window.dom = {
    create(string){
        const container = document.createElement("template");
        container.innerHTML = string.trim();
        return container.content.firstChild;
    },
//template 标签 : 1.可以容纳任意元素；2.不能通过container.children[0]拿到 ; 要用container.content.firstChild;
//string.trim() : trim 功能是将字符串两边的空格去掉
    after(node, node2){
        node.parentNode.insertBefore(node2, node.nextSibling);//用insertBefore的方法把node2插到node的下一个节点的前面，那也就是在node后面插个node2。即使node是最后一个也可以。
    },
    before(node,node2){
        node.parentNode.insertBefore(node2, node);
    },
    append(parent,node){
        parent.appendChild(node);
    },
    wrap(node,parent){
        dom.before(node,parent);
        dom.append(parent,node);
    },
    remove(node){
        node.parentNode.removeChild(node);
        return node;//return一下可以保留对于这个节点的引用。
    },
    empty(node){
        const {childNodes} = node;//简写，等同于 const childNodes = node.childNodes
        const array = [];
        let x = node.firstChild;
        while(x){
            array.push(dom.remove(node.firstChild))
            x = node.firstChild
        }
        return array;//删除并保留对于这个节点的引用。
        //这里不用for循环遍历是因为childNodes里面的元素删掉后它的length是会变化的，最终会多出一个undefined。
        //注意这里用while循环会出现文本节点，因为有空格（回车）。
    },
    attr(node, name, value){
        if(arguments.length === 3){
            node.setAttribute(name, value)
        }else if(arguments.length === 2){
            return node.getAttribute(name)
        }//这种方法叫“重载”；也就是根据不同的参数(或参数不同的长度)获取到不同的效果
    },
    text(node, string){
        if(arguments.length === 2){
            if('innerText in node'){
              node.innerText = string//(ie)
            }else{
              node.textContent = string//(firefox / chrome）
            }//以上的写代码方式成为“适配”，可满足所有浏览器;
            //除了少数IE浏览器只支持第一种写法外外其他浏览器都支持两种写法;
            //会改变对应标签内所有内容，不保留标签内的标签
        }else if(arguments.length === 1){
            if('innerText in node'){
              return node.innerText
            }else{
              return node.textContent
            }
        }
    },
    html(node, string){
        if(arguments.length === 2){
          node.innerHTML = string
        }else if(arguments.length === 1){
          return node.innerHTML
        }
    },
    style(node, name, value){
        if(arguments.length === 3){// dom.style(div, 'color', 'red')
            node.style[name] = value
        }else if(arguments.length === 2){// dom.style(div, 'color')
            if(typeof name === 'string'){
                return node.style[name]
            }else if(name instanceof Object){// dom.style(test, {color:'blue'})
                const object = name
                for(let key in object){
                    node.style[key] = object[key]
                }//key可能是border、color...是一个变量，不能用node.style.key = ...;如果这样写key是字符串，不是变量。
            }
        }
        
    },
    class:{
        add(node,  className){
            node.classList.add(className)
        },
        remove(node, className){
            node.classList.remove(className)
        },
        has(node, className){
            return node.classList.contains(className)
        }
    },
    on(node, eventName, fn){
        node.addEventListener(eventName, fn)
    },
    off(node, eventName, fn){
        node.removeEventListener(eventName, fn)
    },
    find(selector, scope){
        return (scope || document).querySelectorAll(selector)//如果有scope，就在scope里面调用document.querySelectorAll；没有就用document调用document.querySelectorAll
    },
    //给一个选择器，返回对应的元素；无论给的选择器有几个元素，通过调用document.querySelectorAll全部返回一个数组
    //scope : 范围
    parent(node){
        return node.parentNode
    },
    children(node){
        return node.children
    },
    siblings(node){
        return Array.from(node.parentNode.children)
        .filter(n=>n!==node)
    },
    //将伪数组node.parentNode.children变成数组后使用filter将不等于node的放到数组里面
    // !== 符号是一个 ！和两个 = 打出来的
    next(node){
        let x = node.nextSibling
        while(x && x.nodeType === 3){
            x = x.nextSibling
        }
        return x
    },
    //nodeType 的 text 是 3 (可查MDN)
    //代码意思是当x存在并且是文本时返回文本下一个节点，直到不是文本的节点；最后没有了也要返回
    previous(node){
        let x = node.previousSibling
        while(x && x.nodeType === 3){
            x = x.previousSibling
        }
        return x
    },
    each(nodeList, fn){
        for(let i=0;i<nodeList.length;i++){
            fn.call(null,nodeList[i])
        }
    },
    index(node){
        const list = dom.children(node.parentNode)
        let i
        for(i=0;i<list.length;i++){
            if(list[i] === node){
                break
            }
        }
        return i
    }
};
