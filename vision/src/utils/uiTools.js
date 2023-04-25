import FileSaver from "file-saver";
import XLSX from "xlsx";
//导入uuid.js工具
import { v4 as uuidv4 } from "uuid";

/**
 * elemet-ui el-table数据导出为xlsx表格
 * @param {*} _targetId Element-UI el-table组件的id值
 */
export const exportTableAsXLSX = function(_targetId) {
    //根据table生成Book工作簿
    let wb = XLSX.utils.table_to_book(document.getElementById(_targetId));
    //将Book工作簿作为输出
    let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
    });
    //尝试将当前table内容保存为excel文件
    try {
        FileSaver.saveAs(
            //被导出的blob二进制对象
            new Blob([wbout], { type: "application/octet-stream" }),
            //导出文件的名称+后缀名
            _targetId + ".xlsx"
        );
    } catch (e) {
        if (typeof console != "undefined") console.log(e, wbout);
    }
};
