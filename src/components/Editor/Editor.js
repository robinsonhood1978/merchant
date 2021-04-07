import React from 'react';
import E from 'wangeditor'
//import { inject, observer } from 'mobx-react'
//import { withRouter } from 'react-router-dom'

//@withRouter @inject('appStore') @observer
class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorContent:'<h2><span style="color: rgb(70, 172, 200);">About me</span></h2>'
         };
    }

    componentDidMount() {
        const elemMenu = this.refs.editorElemMenu;
        const elemBody = this.refs.editorElemBody;
        const editor = new E(elemMenu,elemBody)
        

        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
            console.log(editor.txt.html())
            this.setState({
                // editorContent: editor.txt.text()
                editorContent: editor.txt.html()
            })
            if(this.props.onSubmit){
                // this.editor.$txt.text();  // 获取纯文本
            // this.editor.$txt.formatText();  // 获取格式化后的纯文本
                this.props.onSubmit(editor.txt.text());
            }
        }
        editor.customConfig.fontNames = ['Arial', 'Tahoma', 'Verdana'];
        editor.customConfig.lang = {
            '设置标题': 'Set title',
            '字号': 'Font size',
            '字体': 'Font',
            '文字颜色': 'Text color',
            '背景色': 'Background color',
            '对齐方式': 'Alignment',
            '靠左': 'Left',
            '居中': 'Center',
            '靠右': 'Right',
            '默认':'Default',
            '新浪':'Sina',
            '链接文字': 'link text',
            '链接': 'link',
            '上传图片': 'upload image',
            '上传': 'upload',
            '创建': 'init'
            // 还可自定添加更多
        }
        editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            //'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            //'image',  // 插入图片
            'table',  // 表格
            'video',  // 插入视频
            'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ]
        editor.customConfig.uploadImgShowBase64 = true
        editor.create()
        editor.txt.html(this.state.editorContent);
    };

    render() {
        return (
            <div className="shop">
                <div className="text-area" >
                    <div ref="editorElemMenu"
                         style={{backgroundColor:'#f1f1f1',border:"1px solid #ccc"}}
                         className="editorElem-menu">

                    </div>
                    <div
                        style={{
                            padding:"0 10px",
                            overflowY:"scroll",
                            height:300,
                            border:"1px solid #ccc",
                            borderTop:"none"
                        }}
                        ref="editorElemBody" className="editorElem-body">

                    </div>
                </div>
            </div>
        );
    }
}

export default Editor;