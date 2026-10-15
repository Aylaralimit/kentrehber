ALTER TABLE "verticals"
  ADD CONSTRAINT "vertical_slug_format" CHECK (slug ~ '^[a-z][a-z0-9-]{1,63}$'),
  ADD CONSTRAINT "review_before_enable" CHECK (NOT enabled OR (policy_reviewed_at IS NOT NULL AND policy_reviewed_by IS NOT NULL AND length(trim(policy_reviewed_by)) > 0)),
  ADD CONSTRAINT "category_array" CHECK (jsonb_typeof(allowed_categories) = 'array' AND jsonb_array_length(allowed_categories) BETWEEN 1 AND 50),
  ADD CONSTRAINT "fields_array" CHECK (jsonb_typeof(required_fields) = 'array' AND jsonb_array_length(required_fields) <= 30);

CREATE FUNCTION validate_vertical_config() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE item jsonb; field_key text; seen text[] := '{}';
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.allowed_categories) LOOP
    IF jsonb_typeof(item) <> 'string' OR (item #>> '{}') !~ '^[a-z][a-z0-9-]{1,63}$' OR (item #>> '{}') = ANY(seen) THEN
      RAISE EXCEPTION 'Invalid or duplicate category slug' USING ERRCODE = '23514';
    END IF;
    seen := array_append(seen, item #>> '{}');
  END LOOP;
  seen := '{}';
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.required_fields) LOOP
    field_key := item ->> 'key';
    IF jsonb_typeof(item) <> 'object' OR field_key IS NULL OR field_key !~ '^[a-z][a-z0-9_]{0,39}$'
      OR field_key IN ('constructor','prototype','__proto__') OR field_key = ANY(seen)
      OR (item ->> 'type') IS NULL OR (item ->> 'type') NOT IN ('text','number','boolean')
      OR jsonb_typeof(item -> 'required') IS DISTINCT FROM 'boolean'
      OR jsonb_typeof(item -> 'label') IS DISTINCT FROM 'string' OR length(trim(item ->> 'label')) NOT BETWEEN 1 AND 80 THEN
      RAISE EXCEPTION 'Invalid field configuration' USING ERRCODE = '23514';
    END IF;
    seen := array_append(seen, field_key);
  END LOOP;
  IF TG_OP = 'UPDATE' THEN
    IF EXISTS (SELECT 1 FROM categories WHERE vertical_id = NEW.id AND NOT (NEW.allowed_categories ? slug)) THEN
      RAISE EXCEPTION 'Existing category must remain allowed' USING ERRCODE = '23514';
    END IF;
    IF ROW(NEW.slug,NEW.name,NEW.is_adult,NEW.allowed_categories,NEW.required_fields,NEW.moderation_level,NEW.payment_required,NEW.default_tier)
       IS DISTINCT FROM ROW(OLD.slug,OLD.name,OLD.is_adult,OLD.allowed_categories,OLD.required_fields,OLD.moderation_level,OLD.payment_required,OLD.default_tier) THEN
      NEW.enabled := false;
      NEW.policy_reviewed_at := NULL;
      NEW.policy_reviewed_by := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER vertical_config BEFORE INSERT OR UPDATE ON verticals FOR EACH ROW EXECUTE FUNCTION validate_vertical_config();

CREATE FUNCTION validate_category_scope() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE allowed jsonb;
BEGIN
  SELECT allowed_categories INTO allowed FROM verticals WHERE id = NEW.vertical_id FOR UPDATE;
  IF allowed IS NULL OR NOT (allowed ? NEW.slug) THEN
    RAISE EXCEPTION 'Category is outside the vertical configuration' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER category_scope BEFORE INSERT OR UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION validate_category_scope();
