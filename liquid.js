const { Liquid } = require('liquidjs');

// const printNode = (node) => {
//     console.log('Test >>>', {node, token: node.token.getText(), type: node.type});
  
//     if (node.childNodes) {
//         node.childNodes.forEach((child, i) => printNode(child));
//     }
// }

//   const printTagsAndExpressions = (node, indent = 0) => {
//     const indentStr = ' '.repeat(indent);
//     // console.log('Test >>> ', {tokenText: node.token.getText()});
//     if (node.name) {
//       console.log(`${indentStr}Tag: ${node.name}`);
//       if (node.token && node.token.content) {
//         console.log(`${indentStr}  Expression: ${node.token.content} \n tag: ${node.token.getText()}`);
//       }
//     }
  
//     if (node.children) {
//       for (const child of node.children) {
//         printTagsAndExpressions(child, indent + 2);
//       }
//     }
//   };
  
// const extractTagsAndObjects = (node, result = { tags: [], objects: [] }) => {
//     if (node.name) {
//       result.tags.push(node.name);
//       if (node.token && node.token.content) {
//         result.objects.push(node.token.content);
//       }
//     }
  
//     if (node.token && node.token.value) {
//     //   const regex = /{{(.*?)}}/g;
//       const regex = /{%\s*(.*?)\s*%}|{{\s*(.*?)\s*}}/g;

//       let match;
//       while ((match = regex.exec(node.token.value)) !== null) {
//         result.objects.push(match[1].trim());
//       }
//     }
  
//     if (node.children) {
//       for (const child of node.children) {
//         extractTagsAndObjects(child, result);
//       }
//     }
  
//     return result;
//   };

const getForLoopTags = (token, tags) => {    
    const matches = token.input.match(/{{\s*(.*?)\s*}}/g);
    if (matches) {
        matches.forEach(match => {
            const tag = match.replace(/{{\s*|\s*}}/g, '');
            tags.push(tag);
        });
    }
    return tags;
};
const getNonIterativeTags = (token, tags) => { 
    const splittedContent = token.content.split(' ');
    console.log("Test >>> getNonIterativeTags: ", {splittedContent, token: token.getText()});
    return tags.push(splittedContent[1]);
}

const extractTemplateVars = function (parsedTemplate) {
    const tags = []; 
        const handles = parsedTemplate
        .map((node, i) => {
                const {token} = node;
                // console.log({node, token})
                collection = node.collection;
                const tokenConstructorName = token.constructor.name;
                const tokenName = token?.name;
                // if (tokenConstructorName === 'OutputToken') { 
                //     tags.push(token.content || token.getText());
                //     // console.log({token: token.getText(), kind: token.kind, content: token.content, name: token.name, input: token.input});
                // } else 
                if (tokenConstructorName === 'TagToken') {
                    // console.log({token: token.getText(), kind: token.kind, content: token.content, name: token.name});
                    if (tokenName !== 'for') {
                        getNonIterativeTags(token, tags);
                    }
                    
                    if(tokenName === 'for') {
                        console.log("Test >>> tkn", {node: node.variable, name: token?.name, val: token?.input.slice(token?.begin, token?.end)});
                        tags.push(node.variable)
                        tags.push(node.token?.input.slice(collection?.begin, collection?.end));
                        getForLoopTags(token, tags);
                        // console.log({token: token.getText(), token});
                    }
                }
                    // const TokenKind = token.kind;
                    // if ([4,8].includes(token?.kind)) {
                        //     return token.content;
                        // }
    })
    .filter((item) => item != null)
    return tags;
  }

  
  
  const validateLiquidContent = content => {        
    try {
      const engine = new Liquid();
      const parseTree = engine.parse(content);
    //   parseTree.forEach(node => printTagsAndExpressions(node));
    //   console.log("Test >>> parseTree: ", parseTree);

    // let result = { tags: [], objects: [] };
    // parseTree.forEach(node => extractTagsAndObjects(node, result));
    // parseTree.forEach(node => printTagsAndExpressions(node));

    // const result = extractTagsAndObjects2(content);
    const result = extractTemplateVars(parseTree);
    // const result = extractVariables(parseTree);
    // console.log("Tags: ", result.tags);
    // console.log("Objects: ", result.objects);
    console.log("Variables: ", result);
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

    {% for challenge in challenges %}
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

const tags = ['first_name', 'first_name', 'challenges', 'handle', 'challenge.mission`', 'challenge.progress', 'challenge.weekly_checkin', ];
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

challenges = [{
    mission: 'Mission 1',
    progress: 'In progress',
    userid: '123',
},
{
    mission: 'Mission 2',
    progress: 'Completed',
},
{
    mission: 'Mission 3',
    progress: 'In progress',
},
];
