$(function () {

    //第一步：基本介面及 text 欄位事件

    $("input.task_name").on("focus", function () {//取得焦點
        //console.log(this);
        $(this).closest("div.task_add_block").addClass("-on");//像上尋找最近一個有div.task_add_block的元素
    });

    $("input.task_name").on("blur", function () {//取消焦點
        //console.log("this");
        $(this).closest("div.task_add_block").removeClass("-on");
    });

    //第二步：新增待辦事項

    //按下「Enter」鍵，也要能新增待辦事項。
    $("input.task_name").on("keyup",function(e){ //當鍵盤抬起 (keyup) 事件發生時，e 就包含了這次事件的所有細節。//需要在定義函式時加上 e，目的是接收事件物件
        //console.log(e.which); //e.which 是事件物件的一個屬性
        if (e.which == 13) {
            $("button.task_add").click();
        };
    });

    //輸入的待辦事項，如果文字的最左邊、最右邊有空格，需移除。(語法：JS 內建的 trim() 函式)。
    $("button.task_add").on("click", function () {
        //console.log("yyy");
        let task_text = ($("input.task_name").val()).trim();//trim()移除前後的空格

        //如果沒有輸入待辦事項，按「新增」的話，不能有任何反應。
        if (task_text != '') {
            let content =
            `<li>
                <div class="item_flex">
                    <div class="left_block">
                        <div class="btn_flex">
                        <button type="button" class="btn_up">往上</button>
                        <button type="button" class="btn_down">往下</button>
                    </div>
                </div>
                <div class="middle_block">
                    <div class="star_block">
                        <span class="star" data-star="1"><i class="fas fa-star"></i></span>
                        <span class="star" data-star="2"><i class="fas fa-star"></i></span>
                        <span class="star" data-star="3"><i class="fas fa-star"></i></span>
                        <span class="star" data-star="4"><i class="fas fa-star"></i></span>
                        <span class="star" data-star="5"><i class="fas fa-star"></i></span>
                    </div>
                    <p class="para">${task_text}</p>
                    <input type="text" class="task_name_update -none" placeholder="更新待辦事項…" value="${task_text}">
                    </div>
                    <div class="right_block">
                        <div class="btn_flex">
                            <button type="button" class="btn_update">更新</button>
                            <button type="button" class="btn_delete">移除</button>
                        </div>
                    </div>
                </div>
            </li>`;

            //按下「新增」按鈕時，將以上的待辦事項 html，新增到 ul.task_list 裡，新增到裡面的最前面。
            $("ul.task_list").prepend(content);

            //新增成功的話，待辦事項欄位要清空。
            //$("input.task_name").empty(); //empty() 方法是用來清空 HTML 元素的子元素和內容，而不是用來清空表單元素 (例如 <input>) 的值
            $("input.task_name").val('');
        }
    });

    //第三步：移除與清空

    //按下「移除」按鈕，淡出 1 秒，然後移除該筆待辦事項。
    $("ul.task_list").on("click", "button.btn_delete", function(){//事件委派，用事件冒泡的方式
        //confirm() (確認框)，用途： 用於徵求使用者的同意或確認操作。按鈕： 有兩個按鈕："確定" (OK) 和 "取消" (Cancel)。
        let sure = confirm("確定要移除嗎?");
        if (sure) {//在 JavaScript 中，當您在 if 條件式中放入一個變數或表達式時，JavaScript 會進行隱式類型轉換 (Type Coercion)，將該值視為布林值來判斷
            $(this).closest("li").animate({
                "opacity": 0
            }, 1000, function(){
                //console.log(this);
                $(this).remove();
            });
        }
    });

    // })
    //按下「清空」按鈕，淡出 1 秒，清除全部的待辦事項。
    $("button.btn_empty").on("click", function(){
        if("ul.task_list" != ''){
            let sure = confirm("確定要清空嗎?");
            if (sure){
                $("ul.task_list").children("li").animate({
                    "opacity": 0
                }, 1000, function(){
                    $(this).remove();
                });
            }
        }
    });

    //第四步：更新待辦事項

    //按下「更新」按鈕，出現一般文字框，然後可以更新。
    $("ul.task_list").on("click", "button.btn_update", function(){
        let para_el = $(this).closest("li").find("p.para");
        let task_name_update_el = $(this).closest("li").find(".task_name_update");

        //如果不是更新狀態就打開可以更新的文字框
        if($(this).attr("data-edit") == undefined) {//可以為任何 HTML 元素新增任何以 data- 開頭的屬性，這些屬性不會影響元素的樣式或功能
            $(this).attr("data-edit", true);
            para_el.toggleClass("-none");
            $(task_name_update_el).toggleClass("-none");
        //已經有更新的文字框
        }else{
            //待辦事項的文字若最左邊、最右邊有空格的話，需移除。
            let task_name_update_text = ($(task_name_update_el).val()).trim();
            //如果所更新的待辦事項，沒有輸入文字，跳出提醒視窗(alert)，顯示「請輸入待辦事項」。
            if (task_name_update_text == ''){
                alert("請輸入待辦事項");
            }else{
                para_el.html(task_name_update_text).toggleClass("-none");//.html()替換元素裡的內容
                $(task_name_update_el).val(task_name_update_text).toggleClass("-none");
                //再按下「更新」按鈕，回到不可編輯的狀態，但待辦事項要是更新的。
                $(this).removeAttr("data-edit");
            }
        }
    });
    
    //第五步：排序
    $("ul.task_list").on("click", "button.btn_up, button.btn_down", function(){

    //按下「往上」按鈕，與上面的待辦事項對調。(註：每個待辦事項是以 li 為單位。)
    //第一個的待辦事項，「往上」按鈕按了要沒反應；最後一個的待辦事項，「往下」按鈕按了要沒反應。

        if($(this).hasClass("btn_up") && !$(this).closest("li").is(":first-child")){

            let chang_text = $(this).closest("li").clone();//.clone()複製元素(原元素的完整副本);.val()獲取/設定值(表單欄位的字串值)
            $(this).closest("li").prev().before(chang_text);
            $(this).closest("li").remove();//.prev()找到該 <li> 在列表中緊接在它前面的兄弟元素。.before()	在前一個 <li> 的外部前面插入。
        }

    //按下「往下」按鈕，與下面的待辦事項對調。

        if($(this).hasClass("btn_down") && !$(this).closest("li").is(":last-child")){

            let chang_text = $(this).closest("li").clone();//.clone()複製元素(原元素的完整副本);.val()獲取/設定值(表單欄位的字串值)
            $(this).closest("li").next().after(chang_text);
            $(this).closest("li").remove();//.next()找到該 <li> 在列表中緊接在它後面的兄弟元素。.after()	在前一個 <li> 的外部後面插入。
        }

    });
    
    //第六步：重要性的星號

    //點擊星號的時候，該星號加上 -on 這個 class，然後該筆待辦事項，星號數( data-star )小於等於點擊的星號數的話，也要加上 -on 這個 class；反之則移除。
    $("ul.task_list").on("click", "span.star", function(e){

        // 獲取當前星級
        let choose_star = parseInt($(this).attr("data-star"));//這裡的星星是選取的那顆星星

        $(this).closest("div.star_block").find("span.star").each(function(){
        
            let allstars = parseInt($(this).attr("data-star"));//這裡的this變成整條全部的星星
    
            if(allstars <= choose_star){
                $(this).addClass("-on");
            }else{
                $(this).removeClass("-on");
            }
        });
    });
    
});

/*
選取元素	CSS 選擇器	    必須加""
創建元素	HTML 字串	    必須加""
傳入物件	變數/物件/函式	 不用加""
傳入 this	this 關鍵字	    不用加"""
*/

//希望在事件處理函式內部存取或利用觸發該事件的相關資訊時，就必須將 e 作為參數傳入函式中