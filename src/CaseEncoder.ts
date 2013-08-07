/// <reference path="../d.ts/jquery.d.ts" />
/// <reference path="../d.ts/ASNParser.d.ts" />
/// <reference path="CaseModel.ts" />

module AssureIt {

	export class JsonNodeModel {
		Type: NodeType;
		Label: string;
		Statement: string;
		Annotations: CaseAnnotation[];
		Notes: CaseNote[];
		Children: JsonNodeModel[];

		constructor() {
		}

	}

	export class CaseEncoder {
		JsonRoot: JsonNodeModel;

		constructor() {
		}

		ConvertToJson(root: NodeModel): JsonNodeModel {
			this.JsonRoot = new JsonNodeModel();
			this.JsonRoot.Type = root.Type;
			this.JsonRoot.Label = root.Label;
			this.JsonRoot.Statement = root.Statement;
			this.JsonRoot.Annotations = root.Annotations;
			this.JsonRoot.Notes = root.Notes;

			var JsonChildNodes: JsonNodeModel[] = new Array<JsonNodeModel>();
			for (var i: number = 0; i < root.Children.length; i++) {
				JsonChildNodes[i] = new JsonNodeModel();
				this.GetChild(root.Children[i], JsonChildNodes[i]);
			}

			this.JsonRoot.Children = JsonChildNodes;

			console.log(this.JsonRoot);
			return this.JsonRoot;
		}

		ConvertToASN(root : NodeModel): string {
			var encoded : string = (function(model : NodeModel, prefix : string) : string {
				var ret : string = "";
				switch (model.Type) {
				case NodeType["Goal"]:
					prefix += "*";
					ret += (prefix + "Goal" + "\n");
					break;
				case NodeType["Context"]:
					if (prefix == "") prefix += "*";
					ret += (prefix + "Context" + "\n");
					break;
				case NodeType["Strategy"]:
					if (prefix == "") prefix += "*";
					ret += (prefix + "Strategy" + "\n");
					break;
				case NodeType["Evidence"]:
					if (prefix == "") prefix += "*";
					ret += (prefix + "Evidence" + "\n");
					break;
				default:
					console.log(model.Type);
				}
				//TODO:Label
				if (model.Statement != "") ret += (model.Statement + "\n");
// 				for (var i = 0; i < model.Annotations.length; i++) {
// 					console.log(model.Annotations[i]);
// 				}
				for (var i = 0; i < model.Children.length; i++) {
					var child_model = model.Children[i];
					console.log(child_model.Type);
					if (child_model.Type == NodeType["Context"]) {
						ret += arguments.callee(child_model, prefix);
						break;
					}
				}
				for (var i = 0; i < model.Children.length; i++) {
					var child_model = model.Children[i];
					if (child_model.Type != NodeType["Context"]) {
						ret += arguments.callee(child_model, prefix);
					}
				}
				return ret;
			})(root, "");
			console.log(encoded);
			return encoded;
		}

		GetChild(root: NodeModel, JsonNode: JsonNodeModel): JsonNodeModel {
			JsonNode.Type = root.Type;
			JsonNode.Label = root.Label;
			JsonNode.Statement = root.Statement;
			JsonNode.Annotations = root.Annotations;
			JsonNode.Notes = root.Notes;

			var ChildNodes: JsonNodeModel[] = new Array<JsonNodeModel>();
			for (var i: number = 0; i < root.Children.length; i++) {
				ChildNodes[i] = new JsonNodeModel();
				this.GetChild(root.Children[i], ChildNodes[i]);
			}

			JsonNode.Children = ChildNodes;

			return JsonNode;
		}
	}
}
