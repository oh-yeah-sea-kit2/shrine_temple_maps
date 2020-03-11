//地図のデフォルト値
var map = L.map('map', {
  zoomsliderControl: true,
  zoomControl: false
}).setView([35.65863174, 139.74542422], 14);

//OSMレイヤー追加
// // openstreetmap
// L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>',
//   maxZoom: 18
// }).addTo(map);

// MapBox
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 20,
  maxNativeZoom: 18,
  minZoom: 5,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1Ijoib2gteWVhaC1zZWEta2l0MiIsImEiOiJjazdrNjkycmsxM3BuM2dxbDBsenBmaWZ4In0.P-NDGl8O6uuGf4pqzwQi0Q'
}).addTo(map);

// メートルの尺度を追加
L.control.scale({ imperial: false }).addTo(map);


// // マップを動かすとマーカーが消えることを検証
// var marker = L.marker([35.65863174, 139.74542422]).bindPopup("<h3>東京タワー</h3>").addTo(map);
// console.log(marker);
// function onMapMoved() {
//   map.removeLayer(marker);
// }
// map.on('move', onMapMoved);

function onLocationFound(e) {
  var radius = e.accuracy;
  L.marker(e.latlng).addTo(map)
    .bindPopup("You are within " + radius + " meters from this point").openPopup();
  L.circle(e.latlng, radius).addTo(map);
}
map.on('locationfound', onLocationFound);

function onLocationError(e) {
  alert(e.message);
}

map.on('locationerror', onLocationError);

function currentPos() {
  //APIに対応していないブラウザを排除
  if (navigator.geolocation === false) {
    alert("位置情報を取得できません。ブラウザが対応していません。");
  }

  var options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };
  //取得成功時の動作設定
  function success(pos) {
    var lat = pos.coords.latitude; //緯度
    var lon = pos.coords.longitude; //経度
    map.setView([lat, lon]); //地図を移動
  }
  //取得失敗時(タイムアウトなど)の動作設定
  function error(err) {
    alert("位置情報を取得できませんでした。デバイスに位置情報を取得できる装置が無い、または取得に時間がかかっている、またはデバイスやブラウザ設定でブロックされています");
  }
  //コマンドを実行
  navigator.geolocation.getCurrentPosition(success, error, options);
}


// 現在地取得処理
function getPosition() {
  // 現在地を取得
  navigator.geolocation.getCurrentPosition(
    // 取得成功した場合
    function(position) {
      let alert_msg = "緯度:" + position.coords.latitude + ",経度" + position.coords.longitude;
      let a = getPos(map);
      alert_msg = alert_msg + "\nzoom : " + a.zoom + " (" + zoomToMeter[a.zoom] + "m)";
      alert(alert_msg);
    },
    // 取得失敗した場合
    function(error) {
      switch (error.code) {
        case 1: //PERMISSION_DENIED
          alert("位置情報の利用が許可されていません");
          break;
        case 2: //POSITION_UNAVAILABLE
          alert("現在位置が取得できませんでした");
          break;
        case 3: //TIMEOUT
          alert("タイムアウトになりました");
          break;
        default:
          alert("その他のエラー(エラーコード:" + error.code + ")");
          break;
      }
    }
  );
}


// $.getJSON("./data/map.json", function(data) {
//   var geojson = L.geoJson(data, {
//     onEachFeature: function(feature, layer) {
//       layer.bindPopup(feature.properties.name);
//     }
//   });
//   geojson.addTo(map);
// });
var add_geojson;

function getShrineFromLonLat() {
  console.log('exec getShrineFromLonLat()');
  let pos = getPos(map);
  let range = zoomToMeter[pos.zoom];

  let param = new Object({
    'lat': pos.lat,
    'lon': pos.lon,
    'range': range
  });
  $.ajax({
    url: shrine_api.url,
    type: 'GET',
    data: param,
    cache: false,
  }).done(function(json) {
    // console.log(json);
    // ピンのリセット
    if (add_geojson != undefined) {
      map.removeLayer(add_geojson);
    }

    var obj = $.parseJSON(json);
    var data = new Object({
      'features': obj['features'],
      'type': obj['type']
    });
    console.log(data);
    var geojson = L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.name + '<br>' + feature.properties.address);
      }
    });
    geojson.addTo(map);
    // ピンリセットのためにマーカーを保存
    add_geojson = geojson;

  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.log('ERROR', jqXHR, textStatus, errorThrown);
  });
}

// 現在の地図の中心緯度経度を取得
function getPos(map) {
  var pos = map.getCenter();
  var zoom = map.getZoom();
  var result = new Object({
    'lat': pos.lat,
    'lon': pos.lng,
    'zoom': zoom
  });
  return result
}
