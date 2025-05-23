<div class="settings">
    <div class="loadScreen"></div>
    <div class="items">
        <div class="item">
            <div class="title">audio volume</div>
            <input type="range" min="0" max="100" value="50" class="inputAudioVolume">
        </div>
        <div class="item">
            <div class="title">game refresh rate</div>
            <label><input type="radio" name="fps" class="inputFps" value="15"> 15 FPS</label>
            <label><input type="radio" name="fps" class="inputFps" value="30"> 30 FPS</label>
            <label><input type="radio" name="fps" class="inputFps" value="45"> 45 FPS</label>
            <label><input type="radio" name="fps" class="inputFps" value="60" checked> 60 FPS</label>
            <label><input type="radio" name="fps" class="inputFps" value="120"> 120 FPS</label>
        </div>
    </div>
    <div class="buttons">
        <div id="settings_apply" class="button">
            <div class="cover"></div>
            <div class="text">apply</div>
        </div>
        <div id="settings_back" class="button">
            <div class="cover"></div>
            <div class="text">back</div>
        </div>
    </div>
</div>