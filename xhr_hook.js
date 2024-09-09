(
    function (){
        let originalXhrOpen = XMLHttpRequest.prototype.open;
        let originalXhrSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url;
            this._method = method;
            return originalXhrOpen.apply(this, arguments);
        };

        // 发送到你的后端
        async function HttpPost(url, data){
            await fetch(url,{body:JSON.stringify(data)})
        }

        // 直接用浏览器下载
        async function downloadFile(url, filename) {
            fetch(url,{headers:{}}).then(response => response.blob()).then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            })
            .catch(e => console.error('Error downloading the video:', e));
        }

        function analysis_douyin(responseData){

            responseData["aweme_list"].forEach(async (value,index)=>{

                let player_address = value["video"]["play_addr"]["url_list"][2]
                let nick_name = value["author"]["nickname"]
                let title = value["desc"]
                let aweme_id = value["aweme_id"]
                // console.log(player_address)
                let file_name = nick_name + title + aweme_id + ".mp4"
                await downloadFile(player_address, file_name)

                let image = data["images"]
                let image_list = value["images"] ? data["images"] : []
                    image_list.forEach((vb, index)=>{
                    let file_name = nickname + "_" + desc + "_" + aweme_id + "_" +vb.uri + ".png"
                    downloadFile(vb.url_list[0], file_name).then()
                })
            })
        }
        function analysis_douyin_video_details(responseData){}
        function analysis_douyin_video_comment(responseData){}


        XMLHttpRequest.prototype.send = function(data) {
            let originalOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = function() {
                if (this.readyState === 4) {
                    // console.log('URL:', this._url);
                    // console.log('Method:', this._method);
                    // console.log('Status:', this.status);
                    // console.log('Response:', this.responseText);

                    if (this._url.includes("/aweme/v1/web/aweme/detail/")){}
                    if (this._url.includes("/aweme/v1/web/comment/list/")){}

                    if (
                        this._url.includes("/aweme/v1/web/tab/feed/") ||
                        this._url.includes("/aweme/v1/web/aweme/post/") ||
                        this._url.includes("/aweme/v1/web/aweme/favorite/") ||
                        this._url.includes("/aweme/v1/web/aweme/listcollection/") ||
                        this._url.includes("/aweme/v1/web/collects/list/") ||
                        this._url.includes("/aweme/v1/web/collects/video/list/") ||
                        this._url.includes("/aweme/v1/web/music/listcollection/")
                    ){
                        let responseData = JSON.parse(this.responseText)
                         // console.log('Response:',responseData );
                        analysis_douyin(responseData)

                    }

                }

                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };

            return originalXhrSend.apply(this, arguments);
        }
    }
)()