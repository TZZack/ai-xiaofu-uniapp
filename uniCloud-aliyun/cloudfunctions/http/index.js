// 提供给http访问，文章相关的curd
'use strict';

const addArticles = require('./addArticles/index')
const deleteArticle = require('./deleteArticle/index')
const updateArticle = require('./updateArticle/index')
const getArticles = require('./getArticles/index')
const getArticleTypes = require('./getArticleTypes/index')
const getArticleById = require('./getArticleById/index')
const addArticleType = require('./addArticleType/index')
const deleteArticleType = require('./deleteArticleType/index')
const deleteAll = require('./deleteAll/index')

const db = uniCloud.database()
exports.main = async (event, context) => {
	let type
	let data
	try{
		const body = JSON.parse(event.body)
		type = body.type
		data = body.data
	}catch(e){
		data = event.data
		type = event.type
	}
	switch(type) {
		case 'addArticles':
			return await addArticles.main(data, context)
		case 'deleteArticle':
			return await deleteArticle.main(data, context)
		case 'updateArticle':
			return await updateArticle.main(data, context)
		case 'getArticles':
			return await getArticles.main()
		case 'getArticleTypes':
			return await getArticleTypes.main()
		case 'getArticleById':
			return await getArticleById.main(data, context)
		case 'addArticleType':
			return await addArticleType.main(data, context)
		case 'deleteArticleType':
			return await deleteArticleType.main(data, context)
		case 'deleteAll':
			return await deleteAll.main()
	}
	
	return event
};
