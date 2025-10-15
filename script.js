class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.x = 0;
    this.y = 0;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    return x;
  }

  leftRotate(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }

  insertNode(node, value) {
    if (!node) return new AVLNode(value);
    if (value < node.value) node.left = this.insertNode(node.left, value);
    else if (value > node.value) node.right = this.insertNode(node.right, value);
    else return node; // duplicate

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    if (balance > 1 && value < node.left.value) return this.rightRotate(node);
    if (balance < -1 && value > node.right.value) return this.leftRotate(node);
    if (balance > 1 && value > node.left.value) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    if (balance < -1 && value < node.right.value) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }

  insert(value) {
    this.root = this.insertNode(this.root, value);
  }

  minValueNode(node) {
    let current = node;
    while (current.left) current = current.left;
    return current;
  }

  deleteNode(node, value) {
    if (!node) return node;
    if (value < node.value) node.left = this.deleteNode(node.left, value);
    else if (value > node.value) node.right = this.deleteNode(node.right, value);
    else {
      if (!node.left || !node.right) node = node.left || node.right;
      else {
        const temp = this.minValueNode(node.right);
        node.value = temp.value;
        node.right = this.deleteNode(node.right, temp.value);
      }
    }

    if (!node) return node;
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);
    if (balance > 1 && this.getBalance(node.left) >= 0) return this.rightRotate(node);
    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    if (balance < -1 && this.getBalance(node.right) <= 0) return this.leftRotate(node);
    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }

  delete(value) {
    this.root = this.deleteNode(this.root, value);
  }
}

// Visualizer
const tree = new AVLTree();
const svg = document.getElementById('treeSVG');
const width = 1000;
const nodeRadius = 20;
svg.setAttribute('width', width);
svg.setAttribute('height', 600);

function assignPositions(node, depth = 0, xMin = 0, xMax = width) {
  if (!node) return;
  node.y = depth * 80 + 50;
  node.x = (xMin + xMax) / 2;
  assignPositions(node.left, depth + 1, xMin, node.x);
  assignPositions(node.right, depth + 1, node.x, xMax);
}

function renderTree() {
  svg.innerHTML = '';
  if (!tree.root) return;

  assignPositions(tree.root);

  function drawLines(node) {
    if (!node) return;
    if (node.left) {
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.left.x);
      line.setAttribute('y2', node.left.y);
      svg.appendChild(line);
      drawLines(node.left);
    }
    if (node.right) {
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.right.x);
      line.setAttribute('y2', node.right.y);
      svg.appendChild(line);
      drawLines(node.right);
    }
  }

  function drawNodes(node) {
    if (!node) return;
    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', nodeRadius);
    circle.classList.add('node-circle');
    svg.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y);
    text.classList.add('node-text');
    text.textContent = node.value;
    svg.appendChild(text);

    drawNodes(node.left);
    drawNodes(node.right);
  }

  drawLines(tree.root);
  drawNodes(tree.root);
}

// Buttons
document.getElementById('insertBtn').addEventListener('click', () => {
  const val = parseInt(document.getElementById('nodeValue').value);
  if (!isNaN(val)) tree.insert(val);
  document.getElementById('nodeValue').value = '';
  renderTree();
});

document.getElementById('deleteBtn').addEventListener('click', () => {
  const val = parseInt(document.getElementById('nodeValue').value);
  if (!isNaN(val)) tree.delete(val);
  document.getElementById('nodeValue').value = '';
  renderTree();
});
