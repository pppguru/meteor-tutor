/**
 * BlogList
 * A collection of bloglist documents, the collection will have an associated tutor, with a list of
 * blogs from BlogContent collection. The following is the schema in which the document will be allowed.
 *
 * Before inserting the BlogList item in the tutors document, we must create the blog (See BlogContent)
 * {
 *  id: String,
 *  tutorId: String,
 *  posts: [String],
 * }
 */
// import { check } from 'meteor/check';
// import { TUTORAPP } from '/both/import/app';
//
// const beforeInsert = (userId, doc) => {
//   /**
//    * 1.   Make sure no document exist where .
//    */
//   console.log(userId);
//   console.log(doc);
// };
//
// const beforeUpdate = (userId, doc, fieldNames, modifier) => {
//
// };
//
// const rawCollection = TUTORAPP.Collections.BlogList().getCollection().getRawCollection();
//
// rawCollection.before.insert(beforeInsert);
// rawCollection.before.update(beforeUpdate);
