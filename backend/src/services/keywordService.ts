import { keywordInclude } from '../utils/includeOptions.js';

import models from '../models/index.js';
const { Keyword } = models;

type Picture = InstanceType<typeof models.Picture>;
type Keyword = InstanceType<typeof models.Keyword>;

export const getKeywordById = async (id: string) => {
  return Keyword.findByPk(id);
};

export const getKeywordWithPictures = async () => {
  return Keyword.findAll({
    include: keywordInclude,
  });
};

export const reloadKeywordWithPictures = async (keyword: Keyword) => {
  return await keyword.reload({
    include: keywordInclude,
  });
};

//helper function for attaching keywords to the picture
export const attachKeywordsToPicture = async (
  picture: Picture,
  keywords: string | string[] | undefined,
) => {
  // check if keywords are provided
  if (!keywords) return;

  // check if keywords are string or array
  if (typeof keywords === 'string') {
    keywords = keywords.split(',').map((kw) => kw.trim());
  }

  // find if keyword already exists in the db
  const existingKeywords = await Keyword.findAll({
    where: { keyword: keywords },
  });

  // create a set of existing keywords for faster lookup
  const existingKeywordSet = new Set(
    existingKeywords.map((kw: { keyword: string }) => kw.keyword),
  );

  // filter out existing keywords from the new keywords
  const newKeywords = keywords.filter((kw) => !existingKeywordSet.has(kw));

  let createdKeywords: InstanceType<typeof models.Keyword>[] = [];

  // create new keywords in the db
  if (newKeywords.length > 0) {
    createdKeywords = await Keyword.bulkCreate(
      newKeywords.map((keyword) => ({ keyword })),
    );
  }

  // combine existing and created keywords
  const allKeywords = [...existingKeywords, ...createdKeywords];

  // get current keywords from the picture
  const currentKeywords = await picture.getKeywords();

  // filter out keywords that picture has but are not in the new keywords
  const keywordsToRemove = currentKeywords.filter(
    (kw: { keyword: string }) => !keywords.includes(kw.keyword),
  );

  // remove keywords that are not in the new keywords
  if (keywordsToRemove.length > 0) {
    await Promise.all(
      keywordsToRemove.map((keyword) => picture.removeKeyword(keyword)),
    );
  }

  // add new/updated keywords to the picture
  await picture.setKeywords(allKeywords);
};
