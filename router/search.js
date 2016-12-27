/**
 * Created by oliver on 16/12/19.
 */
const fs = require('fs')
const cheerio = require('cheerio')
const EventProxy = require('eventproxy')
const rq = require('superagent');
const charset = require('superagent-charset');
charset(rq);
const uft2gb = require('../api/utf2gb');
const scg = require('../api/config');

const search = async(ctx, next) => {
    //await processLibBookInfomation(22323);
    await ctx.render('search/index.ejs', {title: '初始页面'});
    // await next;
//
};
//http://172.16.21.2/museweb/wxjs/tmjs.asp?page=2&txtWxlx=CN&txtTm=C%D3%EF%D1%D4&txtLx=200&txtSearchType=2&nMaxCount=0&nSetPageSize=100&txtPy=HZ&cSortFld=%D5%FD%CC%E2%C3%FB
//http://172.16.21.2/museweb/wxjs/tmjs.asp?&txtWxlx=CN&hidWxlx=spanCNLx&txtPY=HZ&txtTm=C%D3%EF%D1%D4&txtLx=200&txtSearchType=2&nMaxCount=0&nSetPageSize=100&cSortFld=%D5%FD%CC%E2%C3%FB&B1=%BC%EC+%CB%F7
//http://210.45.210.6/museweb/wxjs/tmjs.asp?page=2&txtWxlx=CN&txtTm=C%D3%EF%D1%D4&txtLx=200&txtSearchType=2&nMaxCount=0&nSetPageSize=100&txtPy=HZ&cSortFld=%D5%FD%CC%E2%C3%FB
//http://210.45.210.6/museweb/showmarc/table.asp?nTmpKzh=1200495
const processsLibBookCollecttion = async(keywords, pageno = 1) => {
    let bookList = [];
    let bookCollection = [];
    let url = '';
    let reRecordset = {
        pagesize: 0,
        count: 0,
        pages: 0
    }
    if (pageno == 1) {
        url = scg.siteconfig.mswebserver + "/museweb/wxjs/tmjs.asp?txtWxlx=CN&hidWxlx=spanCNLx&txtPY=HZ&txtTm=" + uft2gb.HZ2GB(keywords) + "&txtLx=200&txtSearchType=2&nMaxCount=0&nSetPageSize=100&cSortFld=%D5%FD%CC%E2%C3%FB&B1=%BC%EC+%CB%F7";
    }
    else {
        url = scg.siteconfig.mswebserver + "/museweb/wxjs/tmjs.asp?page=" + pageno + "&txtWxlx=CN&txtTm=" + uft2gb.HZ2GB(keywords) + "&txtLx=200&txtSearchType=2&nMaxCount=0&nSetPageSize=100&txtPy=HZ&cSortFld=%D5%FD%CC%E2%C3%FB";
    }
//    console.log(url);
    let data = await rq.get(url).charset('gb2312');
    let hmtlinfo = data.text;
    if (!(hmtlinfo.search('<table align="center" border="0" cellspacing="0" width="98%">') === -1)) {
        if (!(hmtlinfo.length === null || hmtlinfo.length === 0)) {
            let tt = hmtlinfo.split('<table align="center" border="0" cellspacing="0" width="98%">');
            //把爬下来的搜索结果分成两部分，为什么？我们要抓搜索的书籍信息，在这个字符之前的都是文件头信息。
            //会把HTML文档，分成一个两个元素的数组,第二个元素就是包含图书信息的部分
            let bookInfo = tt[1].split('</table>');
            let pageinfo = bookInfo[1];
            pageinfo = pageinfo.split('</Center>');
            pageinfo = pageinfo[0];
            pageinfo = pageinfo.split('&nbsp;&nbsp;&nbsp;&nbsp;');
            pageinfo = pageinfo[1];
            pageinfo = pageinfo.split('页次');
            pageinfo = pageinfo[0];
            pageinfo = pageinfo.match(/\d+/g)
            reRecordset.pagesize = pageinfo[1];
            reRecordset.count = pageinfo[0];
            reRecordset.pages = Math.ceil(pageinfo[0] / pageinfo[1]);
            //因为图书信息最后以</table>结;束，后面可能还有个</table>,使用这个标志在分一下，那么结果数组的第一个元素就是我搜索的图书的信息。
            let bookListText = bookInfo[0];
            //这个时候bookListText是一个<tr></tr>的文本，既然处理到这一步了，我们接着我们自己的处理思路，就不用相关的插件了，显然一个特点，
            //两本书之间都以</tr>分开，那个我们在split一下
            let bookListTextTr = bookListText.split('</tr>');
            //这个时候数组的每个单元存储的都是一本书的信息，但多了一个<tr>标志，这个没用，还有前后的空格我们也没用。
            bookListTextTr.forEach(function (item) {
                bookList.push(item.replace('<tr>', '').trim());
            });
            bookList.shift();
            // console.log(bookList);
            bookList.forEach(function (item) {
                let itemi = []
                let x = item.split('</td>')
                x.forEach(function (itx) {
                    let removeclass4m = itx.replace('\r\n    <td class="tdborder4">\r\n', '').trim();
                    let removeclass3 = removeclass4m.replace('<td class="tdborder3" align="center">\r\n', '').trim();
                    let removenbsp = removeclass3.replace('\r\n        &nbsp;', '').trim();
                    let removehref = removenbsp.replace('<td class="tdborder4" align="center">\r\n', '').trim();
                    if (removehref.search('"../') > 0) {
                        removehref = removehref.replace('../showmarc/table.asp?nTmpKzh=' ,'/showbookinfo?bookno=')
                    }

                    if (!(removehref.length == 0))
                        itemi.push(removehref);

                });
                let bookinfo = {
                    booksno: itemi[0],
                    bookmarccdoe: itemi[1],
                    bookname: itemi[2],
                    author: itemi[3],
                    press: itemi[4],
                    pubyear: itemi[5],
                    bookit: itemi[6]
                }
                bookCollection.push(bookinfo)
            });
            //这个时候取出来的bookList就是我们每一本书的信息，这个数组的每个单元都是一条书籍的信息，等等，第一条不是，是什么？自己看妙思搜索的
            //结果，恩恩，是标题栏，我们这是的图书数据是从第一条开始。哈哈，就要万事大吉了，等等，数组的单元里面还有很多的td,仔细观察获取的文档
            //发觉，每一数目条目中，多了个</td>标志，这也是为什么用cheerid加载的时候会只能取两条数据的原因。算了，没多少数据，我一条条解析吧。

        }
    }
    return [bookCollection, reRecordset];

}
const processLibBookInfomation = async(TmpKzh) => {
    //上一个例子我自己写了一个网页分析过程，那个这个网页我用cheerid插件。
    //首先我们要给出的是一个表现书籍详细信息的网页模板，又要做网页，哎，我也很烦，还是用前面介绍过的那网站，想一下，我们该怎么布局。呵呵。
    let url =scg.siteconfig.mswebserver +"/museweb/showmarc/table.asp?nTmpKzh="+TmpKzh;
    let data = await rq.get(url).charset('gb2312');
    let $ = cheerio.load(data.text, {decodeEntities: false})

    //let bookinfo = $('.tableblack .pmain').html()//取出来了，哈哈，就是一张表格的信息
    let bggx = $('.panelContentContainer .panelContent');
    let gzdgx = bggx.next();
    let kpgz = gzdgx.next();
    let otherlink = $('#MARC').next();
    let isbn=otherlink.find('td').find('a').attr('href');
    //let xinfo=otherlink.find('td').html();
    //console.log(xinfo);
    //有个bug如果在地址值出现转义字符，.attr('href')会截取错误，还得自己分析这个字段。我就不处理了，你们发挥想象力。例如：
    //<a href="searchingoogle.asp?cisbn=978-7-301-21540-1&cZtm=" 修养时代"的文学阅读="" "="" target="_blank">
    //.attr('href')只会截取到"searchingoogle.asp?cisbn=978-7-301-21540-1&cZtm="，后面的cheerio就不管了。于是出现了空书名。
    let bxinfo= await processOtherLink(isbn);
    let bookgz = otherlink.next();
    let bookdetailaddress = bookgz.next();
    return [bggx.html(), gzdgx.html(), kpgz.html(), bxinfo, bookgz.html(), bookdetailaddress.html()];
}

const searchresults = async(ctx, next) => {
    let keywords = ctx.request.body.keytsmc;
    //console.log(keywords);
    let bookinfo = await processsLibBookCollecttion(keywords, 1);
    await ctx.render('search/searchresults.ejs', {bookdetail: bookinfo[0], pageinfo: bookinfo[1], title: keywords});
}

const getsesearchresults = async(ctx, next) => {
    let keywords = ctx.request.query.keytsmc;
    console.log(keywords);
    if (keywords == null)
        ctx.redirect('/search');
    else {
        let pageno = ctx.request.query.pageno;
        let bookinfo = await processsLibBookCollecttion(keywords, pageno);
        await ctx.render('search/searchresults.ejs', {bookdetail: bookinfo[0], pageinfo: bookinfo[1], title: keywords});
    }
};


const showbookinfo = async(ctx, next) => {
    let bookno = ctx.request.query.bookno;
    let data = await processLibBookInfomation(bookno)
    await ctx.render('search/bookdetail.ejs', {
        booktile: '书籍详细信息',
        bookbggx: data[0],
        bookgzdgx: data[1],
        bookkpgx: data[2],
        otherlink: data[3],
        bookgz: data[4],
        bookdetailaddress: data[5]
    });
}

const processOtherLink=async(cisbn)=>
//searchingoogle.asp?cisbn=978-7-302-26730-0&cZtm=学习XNA游戏编程
{
    let bookinfo=cisbn.split('=');
    let booname=bookinfo[2].trim();
    let xisbn=bookinfo[1].split('&')
    let isbn=xisbn[0].replace(/-/g,"");
    let bxinfo={isbn:isbn,booname:booname}
    return bxinfo;
}



module.exports = {
    'GET /search': search,
    'POST /searchresults': searchresults,
    'GET /showbookinfo': showbookinfo,
    'GET /searchresults': getsesearchresults

}