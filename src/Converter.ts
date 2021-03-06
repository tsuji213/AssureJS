module AssureIt {

	export class Converter {
		NodeMap : { [index: string]: number};
		
		constructor() {
			this.NodeMap = {};
		}

		ConvertOldNodeTypetoNewNodeType(newNodeListData : any, oldNodeListData : any) : void {
			if(oldNodeListData.NodeType == "Goal") {
				newNodeListData.NodeType = 0;
			}
			else if(oldNodeListData.NodeType == "Context") {
				newNodeListData.NodeType = 1;
			}
			else if(oldNodeListData.NodeType == "Strategy") {
				newNodeListData.NodeType = 2;
			}
			else { //Evidence
				newNodeListData.NodeType = 3;
			}
		}

		ConvertOldNodeListtoNewNodeList(newNodeListData : any, oldNodeListData : any) : void {
			var n : number = oldNodeListData.Children.length;
			for(var i : number = 0; i < n; i++) {
				newNodeListData.Children.push(String(oldNodeListData.Children[i]));
			}
			if(oldNodeListData.Contexts != null && !(oldNodeListData.Contexts instanceof Array)) {
				newNodeListData.Children.push(String(oldNodeListData.Contexts));
			}
			this.ConvertOldNodeTypetoNewNodeType(newNodeListData, oldNodeListData);
			newNodeListData.Statement = oldNodeListData.Description;
			newNodeListData.Label = String(oldNodeListData.ThisNodeId);
			//newNodeListData.Annotation = oldNodeListData.Contexts; //FIXME
			if(oldNodeListData.MetaData != null) {
				n = oldNodeListData.MetaData.length;
				for(var i : number = 0; i < n; i++) {
					var json : any = { 
						"Name" : "",
						"Body" : {}
					};
					json.Name = oldNodeListData.MetaData[i].Type;
					json.Body = oldNodeListData.MetaData[i];
//					console.log(oldNodeListData.MetaData[i].Type);
					newNodeListData.Notes.push(json);
				}
			}
		}

		GenNewJson (oldJsonData : any) : any {
			oldJsonData.contents = JSON.parse(oldJsonData.contents);
			var newJsonData = {
				"DCaseName": "",
				"NodeCount": 0,
				"TopGoalLabel": "",
				"NodeList": []
			}

			newJsonData["DCaseName"] = oldJsonData.contents.DCaseName;
			newJsonData["NodeCount"] = oldJsonData.contents.NodeCount;
			newJsonData["TopGoalLabel"] = String(oldJsonData.contents.TopGoalId);
			var n : number = oldJsonData.contents.NodeList.length;
			for(var i : number = 0; i < n; i++) {
				var NodeListData : any = {
					"Children": [],
					"Statement": "",
					"NodeType": 0,
					"Label": "",
					"Annotations": [],
					"Notes": []
				}
				newJsonData.NodeList.push(NodeListData);
				var newNodeListData : any = newJsonData.NodeList[i];
				var oldNodeListData : any = oldJsonData.contents.NodeList[i];
				this.ConvertOldNodeListtoNewNodeList(newNodeListData, oldNodeListData);
			}
//			console.log(newJsonData.NodeList);
			return newJsonData;
		}

		SetNodeMap(newJsonData : any) : void {
			var NodeList : any = newJsonData.NodeList
			var n : number = NodeList.length;
			for(var i : number = 0; i < n; i++) {
				this.NodeMap[NodeList[i].Label] = i+1;
			}
		}

		ConvertNewNodeTypetoOldNodeType(newNodeListData : any, oldNodeListData : any) : void {
			if(newNodeListData.Type == 0) {
				oldNodeListData.NodeType = "Goal";
			}
			else if(newNodeListData.Type == 1) {
				oldNodeListData.NodeType = "Context";
			}
			else if(newNodeListData.Type == 2) {
				oldNodeListData.NodeType = "Strategy";
			}
			else { //Evidence
				oldNodeListData.NodeType = "Evidence";
			}
		}

		ConvertNewNodeListtoOldNodeList(newNodeListData : any, oldNodeListData : any) : void {
			var n : number = newNodeListData.Children.length;
			for(var i : number = 0; i < n; i++) {
				oldNodeListData.Children.push(this.NodeMap[newNodeListData.Children[i]]);
			}
			this.ConvertNewNodeTypetoOldNodeType(newNodeListData, oldNodeListData);
			oldNodeListData.Description = newNodeListData.Statement;
			oldNodeListData.ThisNodeId = this.NodeMap[newNodeListData.Label];
			oldNodeListData.Contexts = newNodeListData.Annotation; //FIXME
			n = newNodeListData.Notes.length;
			for(var i : number = 0; i < n; i++) {
				oldNodeListData.MetaData.push(newNodeListData.Notes[i].Body);
			}
		}

		GenOldJson (newJsonData : any) : any {
			this.SetNodeMap(newJsonData);
			var oldJsonData = {
				"NodeList": [],
				"TopGoalId":0,
				"NodeCount":0,
				"DCaseName":""
			}

			oldJsonData.DCaseName = newJsonData.DCaseName;
			oldJsonData.NodeCount = newJsonData.NodeCount;
			oldJsonData.TopGoalId = this.NodeMap[newJsonData.TopGoalLabel];
			var n : number = newJsonData.NodeList.length;
			for(var i : number = 0; i < n; i++) {
				var NodeListData : any = {
					"ThisNodeId": 0,
					"NodeType": "",
					"Description": "",
					"Children": [],
					"Contexts": [],
					"MetaData": []
				}
				oldJsonData.NodeList.push(NodeListData);
				var newNodeListData : any = newJsonData.NodeList[i];
				var oldNodeListData : any = oldJsonData.NodeList[i];
				this.ConvertNewNodeListtoOldNodeList(newNodeListData, oldNodeListData);
			}
//			console.log(oldJsonData);
			return oldJsonData;
		}
	}
}

/*
function main () {
	var obj = new Converter();

	var oldJsonData = {
		"contents": {
			"NodeList": [
	{ "ThisNodeId":1,
	  "NodeType":"Goal",
	  "Description":"",
	  "Children":[7,9],
	  "Contexts":[],
	  "MetaData":[]
	},
	{"ThisNodeId":7,
	 "NodeType":"Context",
	 "Description":"",
	 "Children":[],
	 "Contexts":[],
	 "MetaData":[]
	},
	{"ThisNodeId":9,
	 "NodeType":"Strategy",
	 "Description":"",
	 "Children":[10,11],
	 "Contexts":[],
	 "MetaData":[]
	},
	{"ThisNodeId":10,
	 "NodeType":"Goal",
	 "Description":"",
	 "Children":[12],
	 "Contexts":[],
	 "MetaData":[]
	},
	{"ThisNodeId":12,
	 "NodeType":"Evidence",
	 "Description":"",
	 "Children":[],
	 "Contexts":[],
	 "MetaData":[]
	},
	{"ThisNodeId":11,
	 "NodeType":"Goal",
	 "Description":"",
	 "Children":[],
	 "Contexts":[],
	 "MetaData":[]
	}
				],
			"TopGoalId":1,
			"NodeCount":6,
			"DCaseName":"Assure-It サンプル"
		}
	}

//	var newJsonData = obj.GenNewJson(oldJsonData);
	obj.GenNewJson(oldJsonData);

	var newJsonData = {
		"DCaseName": "test",
		"NodeCount": 6,
		"TopGoalLabel": "G1",
		"NodeList": [
			{
				"Children": [
					"S1",
					"C1"
				],
				"Statement": "",
				"NodeType": 0,
				"Label": "G1",
				"Annotations": [],
				"Notes": []
			},
			{
				"Children": [
				],
				"Statement": "",
				"NodeType": 1,
				"Label": "C1",
				"Annotations": [],
				"Notes": []
			},
			{
				"Children": [
					"G2",
					"G3"
				],
				"Statement": "",
				"NodeType": 2,
				"Label": "S1",
				"Annotations": [],
				"Notes": []
			},
			{
				"Children": [
					"E2"
				],
				"Statement": "",
				"NodeType": 0,
				"Label": "G2",
				"Annotations": [],
				"Notes": []
			},
			{
				"Children": [
				],
				"Statement": "",
				"NodeType": 0,
				"Label": "G3",
				"Annotations": [],
				"Notes": []
			},
			{
				"Children": [
				],
				"Statement": "",
				"NodeType": 3,
				"Label": "E2",
				"Annotations": [],
				"Notes": []
			},
		]
	}

	obj.GenOldJson(newJsonData);
}

main();
*/
