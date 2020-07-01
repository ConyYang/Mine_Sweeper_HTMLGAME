(
    function () {
        var JMS = function (
            id,
            rowCount,
            colCount,
            minLandMineCount,
            maxLandMineCount
        ) {
            if (!(this instanceof JMS))
                return new JMS(
                    id,
                    rowCount,
                    colCount,
                    minLandMineCount,
                    maxLandMineCount
                );
            this.doc = document;
            this.table = this.doc.getElementById(id); //table
            this.cells = this.table.getElementsByTagName("td");//squares
            this.rowCount = rowCount || 10; //squares row number
            this.colCount = colCount || 10; //squares column number
            this.landMineCount = 0; //no.of mines
            this.marklandMineCount = 0; //no.of marked mines
            this.minLandMineCount = minLandMineCount || 10; //least no.of mines
            this.maxLandMineCount = maxLandMineCount || 20; //max no.of mines
            this.arrs = []; //squares accorded array
            this.beginTime = null;
            this.endTime = null;
            this.currentStepAccount = 0;
            this.endCallBack = null; //Callback function when game ends
            this.landMineCallBack = null;//Callback function when update remained no.of mines
            this.doc.oncontextmenu = function () {
                //forbidden rightkey menu
                return false;
            };
            this.dropMap();
        };

        //Create Squares in JMS
        JMS.prototype = {
            //draw sqaures
            drawMap: function () {
                var tds = [];
                // Browser Compatibility
                if( window.ActiveXObject &&
                parseInt(navigator.userAgent.match(/msie ([\d.]+)/i)[1]) < 8)
                {
                    // create new css template file
                    var css = "#JMS_main table td{background-color:#888;}",
                        //create head tag
                        head = this.doc.getElementsByTagName("head")[0],
                        //create style label
                        style = this.doc.createElement("style");

                    style.type = "text/css";
                    if (style.styleSheet){
                        //render css template to style label
                        style.styleSheet.cssText = css;
                    }else {
                        // create node in style label
                        style.appendChild(this.doc.createTextNode(css));
                    }
                    head.appendChild(style);
                }
                //create table in for loop
                for (var i=0; i<this.rowCount; i++) {
                    tds.push("<tr>");
                    for (var j = 0; j < this.colCount; j++) {
                        tds.push("<td id='m_" + i + "_" + j + "'></td>");
                    }
                    tds.push("</tr>");
                }
                this.setTableInnerHTML(this.table, tds.join(""));
                },
                setTableInnerHTML: function (table, html) {
                if(navigator && navigator.userAgent.match(/msie/i)){
                    var temp = table.ownerDocument.createElement("div");
                     temp.innerHTML = "<table><tbody>" + html + "</tbody></table>";
                     if (table.tBodies.length == 0) {
                        var tbody = document.createElement("tbody");
                        table.appendChild(tbody);
                        }
                        table.replaceChild(temp.firstChild.firstChild, table.tBodies[0]);
                }else {
                    table.innerHTML = html;
                }
            },
        };
    window.JMS = JMS;
    })();