const { Liquid } = require('liquidjs');

const printNode = (node) => {
    console.log('Test >>>', {node, token: node.token.getText(), type: node.type});
  
    if (node.childNodes) {
        node.childNodes.forEach((child, i) => printNode(child));
    }
}

  const printTagsAndExpressions = (node, indent = 0) => {
    const indentStr = ' '.repeat(indent);
    // console.log('Test >>> ', {tokenText: node.token.getText()});
    if (node.name) {
      console.log(`${indentStr}Tag: ${node.name}`);
      if (node.token && node.token.content) {
        console.log(`${indentStr}  Expression: ${node.token.content} \n tag: ${node.token.getText()}`);
      }
    }
  
    if (node.children) {
      for (const child of node.children) {
        printTagsAndExpressions(child, indent + 2);
      }
    }
  };
  
const extractTagsAndObjects = (node, result = { tags: [], objects: [] }) => {
    if (node.name) {
      result.tags.push(node.name);
      if (node.token && node.token.content) {
        result.objects.push(node.token.content);
      }
    }
  
    if (node.token && node.token.value) {
    //   const regex = /{{(.*?)}}/g;
      const regex = /{%\s*(.*?)\s*%}|{{\s*(.*?)\s*}}/g;

      let match;
      while ((match = regex.exec(node.token.value)) !== null) {
        result.objects.push(match[1].trim());
      }
    }
  
    if (node.children) {
      for (const child of node.children) {
        extractTagsAndObjects(child, result);
      }
    }
  
    return result;
  };

  const extractTagsAndObjects2 = (content) => {
    const tagRegex = /{%\s*(.*?)\s*%}/g;
    const objectRegex = /{{\s*(.*?)\s*}}/g;

    const tags = [];
    let match;
    while ((match = tagRegex.exec(content)) !== null) {
        tags.push(match[1].trim());
    }

    const objects = [];
    while ((match = objectRegex.exec(content)) !== null) {
        objects.push(match[1].trim());
    }

    return { tags, objects };
};

  
  
  const validateLiquidContent = content => {        
    try {
      const engine = new Liquid();
      const parseTree = engine.parse(content);
    //   parseTree.forEach(node => printTagsAndExpressions(node));
      console.log("Test >>> parseTree: ", parseTree);

    // let result = { tags: [], objects: [] };
    // parseTree.forEach(node => extractTagsAndObjects(node, result));
    // parseTree.forEach(node => printTagsAndExpressions(node));

    const result = extractTagsAndObjects2(content);
    console.log("Tags: ", result.tags);
    console.log("Objects: ", result.objects);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

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

    {% assign handle = "cake" %}
    {% case handle %}
    {% when "cake" %}
        This is a cake
    {% when "cookie", "biscuit" %}
        This is a cookie
    {% else %}
        This is not a cake nor a cookie
    {% endcase %}
`;

const template2 = `
{% comment %}
This is a comment and will not be rendered in the output
{% endcomment %}

{% assign today = 'now' | date: "%Y-%m-%d" %}
{% assign name = 'Rakesh' %}
{% assign items = 'apple, banana, cherry' | split: ', ' %}

Hello, {{ name | upcase }}!

Today is {{ today | date: "%A, %B %d, %Y" }}.

{% if name == 'Rakesh' %}
Hello, Rakesh!
{% elsif name == 'Sushant' %}
Hello, Sushant!
{% else %}
Hi, Stranger!
{% endif %}

{% capture welcome_message %}
Welcome to the Liquid template example, {{ name | capitalize }}!
{% endcapture %}
{{ welcome_message }}

Here is a list of your items:
{% for challenge in challenges %}
Mission: {{challenge.mission}}
Progress: {{challenge.progress}}
Weekly checkin: {{challenge.weekly_checkin}}
=====================================
{% endfor %}

{% assign first_item = items | first %}
The first item in your list is {{ first_item }}.

{% assign last_item = items | last %}
The last item in your list is {{ last_item }}.

Let's demonstrate some filters:
{{ 'hello world' | upcase }}
{{ 'HELLO WORLD' | downcase }}
{{ 'hello world' | capitalize }}
{{ 'liquid template' | replace: 'template', 'example' }}
{{ 'apple, banana, cherry' | split: ', ' | join: ' & ' }}

{% assign example_array = "one,two,three" | split: ',' %}
The first element is {{ example_array | first }}
The last element is {{ example_array | last }}

{% include 'snippet' with example_array %}

{% raw %}
This text will not be processed by Liquid.
{% endraw %}
`;

validateLiquidContent(template);