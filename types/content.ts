export type Article = {
  id: string;
  title: string;
  slug: string;
};

export type Topic = {
  id: string;
  name: string;
  articles?: Article[];
};

export type SubCategoryItem = {
  id: string;
  name: string;
  topics: Topic[];
};

export type SubCategory = {
  id: string;
  name: string;
  subCategories: SubCategoryItem[];
};

export type Category = {
  id: string;
  name: string;
  subCategories: SubCategory[];
};
