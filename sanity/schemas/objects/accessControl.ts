import { defineType, defineField } from "sanity"

export const accessControl = defineType({
  name: "accessControl",
  title: "Access Control",
  type: "object",
  fields: [
    defineField({
      name: "tier",
      title: "Minimum Tier",
      type: "string",
      options: {
        list: [
          { title: "Free — visible to everyone", value: "free" },
          { title: "Scholar — requires active membership", value: "scholar" },
          { title: "Founding Patron — exclusive tier only", value: "founding-patron" },
        ],
        layout: "radio",
      },
      initialValue: "free",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "previewable",
      title: "Non-members can preview",
      type: "boolean",
      description:
        "When enabled, non-members see a truncated version before the access gate.",
      initialValue: false,
    }),
  ],
  options: { collapsed: false, collapsible: true },
})
