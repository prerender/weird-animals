export interface Animal {
  name: string;
  scientificName: string;
  category: string;
  habitat: string;
  location: string;
  description: string;
  funFacts: string[];
  conservationStatus:
    | "Least Concern"
    | "Near Threatened"
    | "Vulnerable"
    | "Endangered"
    | "Critically Endangered"
    | "Extinct in the Wild"
    | "Extinct";
  image: string;
  size: string;
  diet: string;
}
