// 更新文章
'use strict';

const db = uniCloud.database()
exports.main = async (data, context) => {
	const { id, newValue } = data
	if (!id || !newValue) {
		return null
	}
	
	if (newValue.id) {
		newValue._id = newValue.id
		delete newValue.id
	}
	if (newValue.type) {
		const typeRet = await db.collection('article-types').get()
		const typeList = typeRet.data
		const targetType = typeList.find(type => type.alias === newValue.type)
		newValue.type = targetType ? targetType.value : 999 // 999 为其他
	}
	if (newValue.create_time) {
		newValue.create_time = new Date(newValue.create_time)
	}

	return await db.collection('articles').doc(id).update(newValue)
};
