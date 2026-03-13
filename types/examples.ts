export type ExampleFile = {
  name: string;
  path: string;
  content: string;
};

export type ExampleGroup = {
  id: string;
  label: string;
  files: ExampleFile[];
};
