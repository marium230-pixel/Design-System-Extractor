export interface ColorToken {
  hex: string;
  role: string;
  notes: string;
}

export interface TypographyToken {
  style: string;
  size: string;
  weight: string;
  font_category: string;
}

export interface SpacingToken {
  base_unit: string;
  padding_pattern: string;
  grid_notes: string;
}

export interface ComponentToken {
  name: string;
  border_radius: string;
  fill_style: string;
}

export interface DesignSystem {
  colors: ColorToken[];
  typography: TypographyToken[];
  components: ComponentToken[];
  spacing: SpacingToken;
  review?: {
    review_status: "confirmed" | "issues_found";
    notes: string[];
  };
}
