// sanity/schemas/post.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Posts',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: r => r.required() }),
    defineField({
      name: 'slug', type: 'slug', title: 'Slug',
      options: { source: 'title', maxLength: 96 }, validation: r => r.required()
    }),
    defineField({
      name: 'coverImage', type: 'image', title: 'Cover Image',
      options: { hotspot: true }, validation: r => r.required()
    }),
    defineField({
      name: 'content', title: 'Content', type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      validation: r => r.required()
    }),
    defineField({
      name: 'publishedAt', type: 'datetime', title: 'Published At',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }),
  ],
  orderings: [
    { title: 'Published: New → Old', name: 'publishedDesc', by: [{field: 'publishedAt', direction: 'desc'}] },
    { title: 'Created: New → Old',   name: 'createdDesc',   by: [{field: '_createdAt',  direction: 'desc'}] },
  ],
  preview: { select: { title: 'title', media: 'coverImage' } },
})
