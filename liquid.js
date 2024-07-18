const { Liquid } = require('liquidjs');

// Function to print the parse tree
const printNode = (node, indent = 0) => {
    const indentStr = ' '.repeat(indent);
    console.log(`Test >>> ${indentStr}${node.type}: ${node.token ? node.token.getText() : ''}`, {Token: node.token.getText(), type: node.type});
  
    if (node.childNodes) {
        node.childNodes.forEach((child, i) => printNode(child, i + 2));
    }
}

const validateLiquidContent = content => {        
    try {
        const engine = new Liquid();
          const parseTree = engine.parse(content);
          parseTree.forEach (node => printNode(node));
          console.log("Test >>> Parse Tree: ", parseTree);
    } catch (error) {
        console.log("Test >>> Error ", error);
    }
  }

const template = `
    Hi {{first_name}},
    {% if first_name == 'rakesh' %}
        Hello!
    {% elsif first_name == 'sushant' %}
        Hello Sushant
    {% else %}
        Hi Stranger
    {% endif %}

    {% for abc in challenges %}
        Mission: {{challenge.mission}}
        Progress: {{challenge.progress}}
        Weekly checkin: {{challenge.weekly_checkin}}
        =====================================
    {% endfor %}
`;

validateLiquidContent(template);