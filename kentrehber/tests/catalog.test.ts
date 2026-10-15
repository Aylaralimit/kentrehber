import { describe, expect, it } from 'vitest';
import {
  catalogContentSchema,
  defaultCatalogContent,
  normalizeCatalogContent,
} from '../packages/config/src/catalog';

describe('catalog editor validation', () => {
  it('starts with safe empty public content', () => {
    expect(defaultCatalogContent.cards).toEqual([]);
    expect(normalizeCatalogContent(null)).toEqual(defaultCatalogContent);
  });

  it('accepts configured editorial cards and HTTPS images', () => {
    const content = {
      ...defaultCatalogContent,
      heroImageUrl: 'https://images.example.com/cover.jpg',
      cards: [
        {
          title: 'Koleksiyon',
          eyebrow: 'Kategori',
          description: 'Açıklama',
          imageUrl: 'https://images.example.com/card.jpg',
        },
      ],
    };
    expect(catalogContentSchema.parse(content)).toEqual(content);
  });

  it('rejects unsafe URLs, excessive cards and unknown content', () => {
    const examples = [
      { ...defaultCatalogContent, heroImageUrl: 'javascript:alert(1)' },
      { ...defaultCatalogContent, heroImageUrl: 'http://images.example.com/a.jpg' },
      { ...defaultCatalogContent, heroImageUrl: 'https://user:pass@example.com/a.jpg' },
      { ...defaultCatalogContent, title: '' },
      { ...defaultCatalogContent, cards: Array.from({ length: 7 }, () => ({
        title: 'X', eyebrow: '', description: '', imageUrl: '',
      })) },
      { ...defaultCatalogContent, unknown: true },
    ];
    for (const value of examples) expect(catalogContentSchema.safeParse(value).success).toBe(false);
  });
});
