import getTaskStatus from "./service/cache/getTaskStatus.js";
import killTask from "./service/cache/killTask.js";
import truncateLayer from "./service/cache/truncateLayer.js";
import seedLayer from "./service/cache/seedLayer.js";

import getLayerConfig from "./service/layer/getLayerConfig.js";


// killTask("umap:hochiminh-basemap")
// seedLayer("umap:hochiminh-basemap")
// truncateLayer("umap:hochiminh-basemap")
// getTaskStatus("umap:hochiminh-basemap")

getLayerConfig("umap:hochiminh-basemap")