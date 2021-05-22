export interface CreateArticleInterface {
  title: string;
  content: string;
  introduction: string;
  original: string;
}

export interface ModifyArticle extends CreateArticleInterface {
  [index: number]: string;
}
