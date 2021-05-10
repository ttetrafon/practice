function Node(data) {
	this.data = data;
	this.children = [];
}

class Tree {
	constructor() {
		this.root = null;
	}

	add(data, toNodeData) {
		const node = new Node(data);
		const parent = toNodeData ? this.findBFS(toNodeData) : null;
		if (parent) {
			parent.children.push(node);
		}
		else {
			if (!this.root) {
				this.root = node;
			}
			else {
				return 'Error: Node cannot be stored as root; root already exits';
			}
		}
	}

	findBFS(data) {
		const queue = [this.root];
		let _node = null;
		this.traverseBFS((node) => {
			if(node.data == data) {
				_node = node;
			}
		});
		return _node;
	}

	traverseBFS(cb) {
		const queue = [this.root];
		if (cb) {
			while (queue.length > 0) {
				const node = queue.shift();
				cb(node);
				for (const child of node.children) {
					queue.push(child);
				}
			}
		}
	}
}

(function test() {
	let tree = new Tree();
	tree.add('Node1');
	tree.add('Node2', 'Node1');
	tree.add('Node3', 'Node1');
	tree.add('Node4', 'Node2');
	tree.add('Node5', 'Node3');
	tree.add('Node6', 'Node2');

	tree.traverseBFS((node) => {
		console.log('Current Node:', node, '\n');
	});
})();
