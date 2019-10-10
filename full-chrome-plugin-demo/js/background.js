//-------------------- 右键菜单演示 ------------------------//
chrome.contextMenus.create({
	title: 'JsonToModel', // %s表示选中的文字
	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
	onclick: function(params)
	{
		// 注意不能使用location.href，因为location是属于background的window对象
		var text = params.selectionText;
		var jsonObj = JSON.parse(text);
		var modelStr = "";
		for (key in jsonObj) {
			var value = jsonObj[key];
			var type = typeof value;
			if (type == "string") {
				modelStr += "@property (nonatomic, copy) NSString *"+key+";\n";
			} 
			else if (type == "number") {
				if (this.hasSuffixId(key)) {
					modelStr += "@property (nonatomic, copy) NSString *"+key+";\n";
				} else {
					modelStr += "@property (nonatomic, assign) NSInteger "+key+";\n";
				}
			}
			else if (type == "boolean") {
				modelStr += "@property (nonatomic, assign) BOOL "+key+";\n";
			}
			else if (type == "object") {
				if (this.isArray(value)) {
					modelStr += "@property (nonatomic, strong) NSArray *"+key+";\n";
				} else {
					modelStr += "@property (nonatomic, strong) MM"+key+" *"+key+";\n";
				}
			}
		}

		// chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(modelStr)});
		alert(modelStr);

		//复制内容
		const input = document.createElement('textarea');
		document.body.appendChild(input);
	 	input.setAttribute('value', modelStr);
		input.select();
		if (document.execCommand('copy')) {
			document.execCommand('copy');
			console.log('复制成功');
		}
	    document.body.removeChild(input);
		

	}
});


function isArray(myArray) {
    return myArray.constructor.toString().indexOf("Array") > -1;
};

function hasSuffixId(key) {
	var s = key.lastIndexOf("_");
	var suffix = key.substring(s+1).toLowerCase();
	return suffix == "id";
};

