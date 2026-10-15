INSERT INTO verticals (id, slug, name, allowed_categories, required_fields, moderation_level, payment_required, default_tier, enabled, updated_at, theme)
VALUES
('theme-reference-restoran', 'restoran', 'Restoran', '["genel"]'::jsonb, '[]'::jsonb, 'standard', false, 'free', false, CURRENT_TIMESTAMP,
'{"colors":{"bg":"#191917","surface":"#22221f","elevated":"#2d2d28","border":"#414139","text":"#f2f0e6","muted":"#b5b5a5","accent":"#d6dd9c","accentAlt":"#dab69c"},"fonts":{"display":"Georgia","body":"Arial"},"radius":"lg","cardDensity":"normal","heroStyle":"plain","ctaLabel":"İletişim","ageGateEnabled":false,"showPrice":false,"visibleFields":[]}'::jsonb),
('theme-reference-wellness', 'wellness', 'Wellness', '["genel"]'::jsonb, '[]'::jsonb, 'standard', false, 'free', false, CURRENT_TIMESTAMP,
'{"colors":{"bg":"#14201d","surface":"#1d2d28","elevated":"#293d35","border":"#40594c","text":"#eef4e9","muted":"#adc3b1","accent":"#c0dbb3","accentAlt":"#d9c2dd"},"fonts":{"display":"Georgia","body":"Arial"},"radius":"md","cardDensity":"loose","heroStyle":"gradient","ctaLabel":"İletişim","ageGateEnabled":false,"showPrice":false,"visibleFields":[]}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET theme = EXCLUDED.theme, updated_at = CURRENT_TIMESTAMP
WHERE verticals.theme = '{}'::jsonb;
