/**
 * This file is only used for bootstrapping the ImageGrid.
 * This is not needed to actually run the ImageGrid.
 *
 * @file			bootstap.js
 * @package			BH
 * @dependencies	BH.ImageGrid
 */

;(function(App, window, document, undefined) {
	'use strict';

	var jsonUrl = "https://raw.githubusercontent.com/originalnicodrgitbot/test-git-python/main/shotsdb.json";

	function Shot(id, author, authorsAvatarUrl, date, gameName, score, width, height, shotUrl, thumbnailUrl)
	{
		this.id = id;
		this.author = author;
		this.authorsAvatarUrl = authorsAvatarUrl;
		this.data = date;
		this.gameName = gameName;
		this.score = score;
		this.width = width;
		this.height = height;
		this.thumbWidth = width / 4.8;
		this.thumbHeight = height / 4.8;
		this.shotUrl = shotUrl;
		this.thumbnailUrl = thumbnailUrl;
	}
	
	jQuery.getJSON(jsonUrl, function(data) 
		{ 
			var shots = [];
			Object.entries(data._default).forEach((x) => 
				{ 
					var id = x[0];
					var shotData = x[1];
					shots.push(new Shot(id, shotData.author, shotData.authorsAvatarUrl, shotData.date, shotData.gameName, shotData.score,
										shotData.width, shotData.height, shotData.shotUrl, shotData.thumbnailUrl));
				});
			var container = document.querySelectorAll('.gridContainer');

			if(container.length != 0) {
				new App.ImageGrid(shots, container[0], 300, 5);
			}
		});

}(window.BH = window.BH || {}, window, document));