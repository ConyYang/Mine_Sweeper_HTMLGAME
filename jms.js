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
            this.drawMap();
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
            init: function () {
                for(var i =0; i < this.rowCount; i++)
                {
                    this.arrs[i] = [];
                    for (var j=0; j<this.colCount; j++)
                    {
                        this.arrs[i][j] = 0;
                    }
                }
                this.landMineCount = this.selectFrom(this.minLandMineCount, this.maxLandMineCount);
                this.markLandMineCount = 0;
                this.beginTime = null;
                this.endTime = null;
                this.currentSetpCount = 0;
            },
            landMine: function () {
                var allCount = this.rowCount * this.colCount -1;
                tempArr = {};
                for (var i =0; i<this.landMineCount; i++){
                    var randomNum = this.selectFrom(0, allCount),
                        rowCol = this.getRowCol(randomNum);
                    if (randomNum in tempArr){
                        i--;
                        continue;
                    }
                    this.arrs[rowCol.row][rowCol.col] = 9;
                    tempArr[randomNum] = randomNum
                }
            },
            getRowCol: function (val) {
                return {
                    row: parseInt(val / this.colCount),
                    col: val % this.colCount};
},
            selectFrom: function (iFirstValue, iLastValue) {
                var iChoices = iLastValue - iFirstValue + 1;
                return Math.floor(Math.random() * iChoices + iFirstValue);
                },
            calculateNoLandMineCount: function () {
                for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
            if (this.arrs[i][j] == 9)
                continue;
            if (i > 0 && j > 0) {
                if (this.arrs[i - 1][j - 1] == 9)
                    this.arrs[i][j]++;
            }
            if (i > 0) {
                if (this.arrs[i - 1][j] == 9)
                    this.arrs[i][j]++;
            }
            if (i > 0 && j < this.colCount - 1) {
                if (this.arrs[i - 1][j + 1] == 9)
                    this.arrs[i][j]++;
            }
            if (j > 0) {
                if (this.arrs[i][j - 1] == 9)
                    this.arrs[i][j]++;
            }
            if (j < this.colCount - 1) {
                if (this.arrs[i][j + 1] == 9)
                    this.arrs[i][j]++;
            }
            if (i < this.rowCount - 1 && j > 0) {
                if (this.arrs[i + 1][j - 1] == 9)
                    this.arrs[i][j]++;
            }
            if (i < this.rowCount - 1) {
                if (this.arrs[i + 1][j] == 9)
                    this.arrs[i][j]++;
            }
            if (i < this.rowCount - 1 && j < this.colCount - 1) {
                if (this.arrs[i + 1][j + 1] == 9)
                    this.arrs[i][j]++;
            }
        }
    }
                },
            $: function (id) {
                return this.doc.getElementById(id);},
            bindCells: function () {
                    var self = this;
                    for (var i = 0; i < this.rowCount; i++) {
                        for (var j = 0; j < this.colCount; j++) {
                            (function (row, col) {
                                self.$("m_" + i + "_" + j).onmousedown = function (e) {
                                    e = e || window.event;
                                    var mouseNum = e.button;
                                    var className = this.className;
                                    if (mouseNum == 2) {
                                        if (className == "flag") {
                                            this.className = "";
                                            self.markLandMineCount--;
                                        } else {
                                            this.className = "flag";
                                            self.markLandMineCount++;
                                        }
                                        if (self.landMineCallBack) {
                                            self.landMineCallBack(self.landMineCount - self.markLandMineCount);
                                        }
                                    } else if (className != "flag") {
                                        self.openBlock.call(self, this, row, col);
                                    }
                                };
                            })(i,j);
                        }
                    }
                },
            showNoLandMine: function (x, y) {
                for (var i = x - 1; i < x + 2; i++)
                    for (var j = y - 1; j < y + 2; j++) {
                        if (!(i == x && j == y)) {
                            var ele = this.$("m_" + i + "_" + j);
                            if (ele && ele.className == "") {
                                this.openBlock.call(this, ele, i, j);
                            }
                        }
                    }
            },
            openBlock: function (obj, x, y) {
                    if (this.arrs[x][y] != 9) {
                        this.currentSetpCount++;
                        if (this.arrs[x][y] != 0) {
                            obj.innerHTML = this.arrs[x][y];
                        }
                        obj.className = "normal";
                        if (this.currentSetpCount + this.landMineCount == this.rowCount * this.colCount) {
                            this.success();
                        }
                        obj.onmousedown = null;
                        if (this.arrs[x][y] == 0) {
                            this.showNoLandMine.call(this, x, y);
                        }
                    } else {
                        this.failed();
                    }
                },
            showAll: function () {
                    for (var i = 0; i < this.rowCount; i++) {
                        for (var j = 0; j < this.colCount; j++) {
                            if (this.arrs[i][j] == 9) {
                                this.$("m_" + i + "_" + j).className = "landMine";
                            } else {
                                var ele=this.$("m_" + i + "_" + j);
                                if (this.arrs[i][j] != 0)
                                    ele.innerHTML = this.arrs[i][j];
                                ele.className = "normal";
                            }
                        }
                    }
                },
            hideAll: function () {
                    for (var i = 0; i < this.rowCount; i++) {
                        for (var j = 0; j < this.colCount; j++) {
                            var tdCell = this.$("m_" + i + "_" + j);
                            tdCell.className = "";
                            tdCell.innerHTML = "";
                        }
                    }
                },
            disableAll: function () {
                    for (var i = 0; i < this.rowCount; i++) {
                        for (var j = 0; j < this.colCount; j++) {
                            var tdCell = this.$("m_" + i + "_" + j);
                            tdCell.onmousedown = null;
                        }
                    }
                },
            begin: function () {
                this.currentSetpCount = 0;//开始的步数清零
                this.markLandMineCount = 0;
                this.beginTime = new Date();//游戏开始时间
                this.hideAll();
                this.bindCells();
            },
            end: function () {
                this.endTime = new Date();//游戏结束时间
                if (this.endCallBack) {//如果有回调函数则调用
                    this.endCallBack();
                }
            },
            success: function () {
                this.end();
                this.showAll();
                this.disableAll();
                alert("Congratulation！");
            },
            failed: function () {
                this.end();
                this.showAll();
                this.disableAll();
                alert("GAME OVER！");
            },
            play: function () {
                this.init();
                this.landMine();
                this.calculateNoLandMineCount();
            },
        };
    window.JMS = JMS;
    })();