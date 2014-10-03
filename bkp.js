<!DOCTYPE html>
<html>
    <head>
        <title>Chroma key using JavaScript</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        
        <style type="text/css">
            canvas{
                display: block;
                border: solid 1px red;
                background-image: url(bg1.png);
                background-size: 100% 100%;
                margin: auto;
            }
            video{
                border: solid 1px red;
                position: absolute;
                top: -999px;
            }
            body{
                background-color: appworkspace;
            }
        </style>
        
    </head>
    <body>
        <div style="text-align: center;">
            <input type="button" value="Start" onclick="window.ck.start();" /><br/>
            <video id="video" autoplay="autoplay" width="360" height="270"></video>
            <canvas id="canvas" width="360" height="270"></canvas><br/>
            <input id="range" type="range" value="100" min="0" max="255" />
        </div>
        <div style='width: 400px; margin: auto; margin-top: 20px;'>
            <em>- Click the Start buttono and allow the page to use your camera;</em><br/>
            <em>- Click the image to capture the current pixel;</em><br/>
            <em>- Use the slider to change the sensitivity;</em><br/>
            <em>- See the code or fork it at <a href='https://github.com/felipenmoura/js-chroma-key/'>Github's Felipe N. Moura projects list</a>;</em><br/>
        </div>
        
        <script>
            
            
            window.ck= (function(_d){
    
    var _video= _d.getElementById('video'),
        _canvas= _d.getElementById('canvas'),
        _ctx= _canvas.getContext('2d'),
        _n= navigator,
        _w= window,
        _width= 0,
        _height= 0,
        _tmpCtx     = _d.createElement('canvas'),
        _range      = 80,
        _colors     = [0, 0, 200];
    
    _tmpCtx.width= _canvas.offsetWidth;
    _tmpCtx.height= _canvas.offsetHeight;
    
    _tmpCtx= _tmpCtx.getContext('2d');
    
    var _videoPlaying= function(event){
        
        var frame= '',
            data= null,
            l,
            r, g, b;
        
        if(!_width){
            _width= _video.offsetWidth;
            _height= _video.offsetHeight;
        }
        
        _tmpCtx.drawImage(_video, 0, 0, _width, _height);
        
        frame= _tmpCtx.getImageData(0, 0, _width, _height);
        data= frame.data;
        
        l= data.length/4;
        while(l--){
            r= data[l*4];
            g= data[l*4+1];
            b= data[l*4+2];
            
            if(Math.abs(r-_colors[0]) < 250-_range
                &&
               Math.abs(g-_colors[1]) < 250-_range
                &&
               Math.abs(b-_colors[2]) < 250-_range)
            {
                frame.data[l*4+3]= 0;
            }
            
        }
        
        _ctx.putImageData(frame, 0, 0);
    };
    
    var _videoClick= function(evt){
        var line= evt.offsetY,
            col= evt.offsetX,
            frame= _ctx.getImageData(col, line, 1, 1),
            px= [frame.data[0], frame.data[1], frame.data[2]];
        _colors= px;
    };
    
    var _constructor= function(){
        _w.URL= _w.URL || _w.webkitURL;
        _n.getUserMedia= _n.getUserMedia||_n.webkitGetUserMedia||_n.mozGetUserMedia||false;
        
        if(_n.getUserMedia){
            _n.getUserMedia({
                audio: false,
                video: true
            }, function(stream){
                try{
                    stream= _w.URL.createObjectURL(stream);
                }catch(e){
                }
                
                _video.src= stream;
                _video.play();
                
                _canvas.addEventListener('click', _videoClick);
                setInterval(_videoPlaying, 120);
                _video.style.visibility= 'hidden';
                
                _d.getElementById('range').addEventListener('change', function(){
                    _range= 255 - this.value;
                });
                
            }, function(){
                //alert('nao permitiu');
            });
        }else{
            alert('falhou');
        }
        
    }
    
    return {
        start: _constructor
    };
    
})(document);
            
            
        </script>
        
    </body>
</html>
