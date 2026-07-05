import { DesignSystem } from "../types";

export interface Preset {
  id: string;
  name: string;
  thumbnail: string;
  data: DesignSystem;
}

export const PRESETS: Preset[] = [
  {
    id: "cosmic-dashboard",
    name: "Cosmic Slate Dashboard",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    data: {
      colors: [
        { hex: "#0B0F19", role: "background", notes: "Main page dark background, base canvas" },
        { hex: "#151D30", role: "secondary", notes: "Dashboard cards and modular section background" },
        { hex: "#6366F1", role: "primary", notes: "Primary interactive elements, focus states, active buttons" },
        { hex: "#EC4899", role: "accent", notes: "Secondary highlights, trend line, accent metrics" },
        { hex: "#F8FAFC", role: "text", notes: "Headers and main emphasis body text" }
      ],
      typography: [
        { style: "Display Hero Title", size: "36px", weight: "bold", font_category: "sans-serif (looks like Inter)" },
        { style: "Section Header (H2)", size: "20px", weight: "medium", font_category: "sans-serif" },
        { style: "Body Text / Stats Large", size: "15px", weight: "regular", font_category: "sans-serif" },
        { style: "Micro Metadata / Captions", size: "11px", weight: "regular", font_category: "sans-serif" },
        { style: "Button Text / Tabs", size: "14px", weight: "bold", font_category: "sans-serif" }
      ],
      components: [
        {
          name: "Interactive Analytics Metric Card",
          border_radius: "12px",
          fill_style: "Filled background with translucent glow-indigo highlights"
        },
        {
          name: "Neon Action Button",
          border_radius: "8px",
          fill_style: "Filled background with solid shadow shadow-indigo-600/10"
        },
        {
          name: "Compact Search Sidebar",
          border_radius: "sharp",
          fill_style: "Filled background with custom border-right boundary lines"
        }
      ],
      spacing: {
        base_unit: "8px",
        padding_pattern: "generous",
        grid_notes: "3-column responsive grid layout with 24px modular gaps"
      },
      review: {
        review_status: "confirmed",
        notes: [
          "All extracted core color HEX values are consistent with the slate and indigo dashboard visual components.",
          "Typography styles matched Inter font geometry exactly.",
          "Gaps and spacing verified against the 8px multiplier grid."
        ]
      }
    }
  },
  {
    id: "minimalist-saas",
    name: "Aura Minimalist SaaS",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80",
    data: {
      colors: [
        { hex: "#FAF9F6", role: "background", notes: "Alabaster off-white warm canvas background" },
        { hex: "#FFFFFF", role: "secondary", notes: "Pure white cards with high-contrast sharp borders" },
        { hex: "#111111", role: "primary", notes: "Charcoal absolute interactive links, main headers, button fills" },
        { hex: "#222222", role: "text", notes: "Primary readable body text and paragraph content" },
        { hex: "#777777", role: "accent", notes: "Muted secondary explanations and helper strings" }
      ],
      typography: [
        { style: "Display Swiss Title", size: "42px", weight: "bold", font_category: "sans-serif (looks like Helvetica/Avenir)" },
        { style: "Page Header", size: "24px", weight: "bold", font_category: "sans-serif" },
        { style: "Body Text", size: "16px", weight: "regular", font_category: "sans-serif" },
        { style: "Sidebar Label / Small", size: "13px", weight: "medium", font_category: "sans-serif" }
      ],
      components: [
        {
          name: "Slab Button",
          border_radius: "sharp",
          fill_style: "Solid filled background-color with high contrast text"
        },
        {
          name: "Aura Grid Component Card",
          border_radius: "sharp",
          fill_style: "Outline with 1px border, filled with solid background"
        }
      ],
      spacing: {
        base_unit: "4px",
        padding_pattern: "generous",
        grid_notes: "Symmetrical bento-style modular cards with large padding gutters"
      },
      review: {
        review_status: "issues_found",
        notes: [
          "The accent color #777777 is present in text but is very subtle; check if a darker grey is used for high-contrast accessibility.",
          "Identified possible sans-serif typography as Inter, but listed as 'looks like Helvetica/Avenir' which is a guess.",
          "The 'Aura Grid Component Card' border is 1px sharp; verify if border-radius is strictly 0px."
        ]
      }
    }
  },
  {
    id: "retro-notebook",
    name: "Terminal Amber Retro",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
    data: {
      colors: [
        { hex: "#FFB000", role: "primary", notes: "Bright glowing amber phosphor color for text & active vectors" },
        { hex: "#945D00", role: "secondary", notes: "Dimmer amber state for inactive elements and helper tags" },
        { hex: "#110B00", role: "background", notes: "Deep pitch black CRT glass tube shadow background" },
        { hex: "uncertain", role: "uncertain", notes: "Contrast levels might obscure background shadow layer details" }
      ],
      typography: [
        { style: "Terminal Title (Large)", size: "28px", weight: "bold", font_category: "monospace" },
        { style: "Code Block / Command Line", size: "14px", weight: "regular", font_category: "monospace" },
        { style: "Muted Terminal Logs", size: "12px", weight: "uncertain", font_category: "uncertain" }
      ],
      components: [
        {
          name: "Scanline Console Window",
          border_radius: "rounded",
          fill_style: "Outline border-crt-phosphor with glow effects"
        },
        {
          name: "Chunky Monospace Input",
          border_radius: "sharp",
          fill_style: "Ghost outline dashed border"
        },
        {
          name: "CRT Background Glare",
          border_radius: "uncertain",
          fill_style: "uncertain"
        }
      ],
      spacing: {
        base_unit: "16px",
        padding_pattern: "medium",
        grid_notes: "Character-grid based fixed alignment system layout rules"
      },
      review: {
        review_status: "issues_found",
        notes: [
          "Background hex #110B00 was confirmed, but secondary amber #945D00 has very low contrast on top of it.",
          "Listed spacing base unit is 16px, but layout matches closer to a custom 8px/24px grid.",
          "Several typography fields correctly marked as 'uncertain' due to scanline pixelation."
        ]
      }
    }
  }
];
