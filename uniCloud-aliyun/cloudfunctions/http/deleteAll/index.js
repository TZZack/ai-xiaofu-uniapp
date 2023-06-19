// 删除所有文章记录
'use strict';

const db = uniCloud.database()
exports.main = async () => {
	// limit最大是1000
	const ret = await db.collection('articles').limit(999).get()
	ret.data.forEach(item => {
		if (item._id) {
			db.collection('articles').doc(item._id).remove()
		}
	})

	return '等待后台异步执行...'
};
