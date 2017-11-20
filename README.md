# salesforce-einstein-object-detection-mobile-example

This repo holds an example implementation of how to use [Einstein Object Detection](https://developer.salesforce.com/blogs/2017/10/use-einstein-object-detection.html) within the Salesforce Mobile app.

[![Demo](https://img.youtube.com/vi/4q9NcODRuJQ/0.jpg)](https://www.youtube.com/watch?v=4q9NcODRuJQ)

## Pre-Requisites

In order to use this example you have to install the [Einstein Platform Services Apex wrapper](https://github.com/muenzpraeger/salesforce-einstein-platform-apex).

## Implementation
Use the Salesforce DX CLI to push the example code to a scratch org.

```bash
sfdx force:source:push -u <yourAlias>
```

## Functionality

This repo contains a small [Lightning component](https://github.com/muenzpraeger/salesforce-einstein-object-detection-mobile-example/tree/master/force-app/main/default/aura/ShelfScanner), that can be used in a Lightning page for mobile access. The model id for object detection is [configurable via App Builder](https://github.com/muenzpraeger/salesforce-einstein-object-detection-mobile-example/blob/f8adea0a9a0a5ac4f5d38d9ae1b6ed7953a74a28/force-app/main/default/aura/ShelfScanner/ShelfScanner.design#L2).

The technique is a smaller version of what is included in the Einstein Playground for Object Detection.

Noteworthy information:
- The objects in the image are highlighted in yellow. Custom colors per box/label can be set [here](https://github.com/muenzpraeger/salesforce-einstein-object-detection-mobile-example/blob/f8adea0a9a0a5ac4f5d38d9ae1b6ed7953a74a28/force-app/main/default/aura/ShelfScanner/ShelfScannerHelper.js#L104).
- The number of detected objects and the share of shelf is [calculated](https://github.com/muenzpraeger/salesforce-einstein-object-detection-mobile-example/blob/f8adea0a9a0a5ac4f5d38d9ae1b6ed7953a74a28/force-app/main/default/aura/ShelfScanner/ShelfScannerHelper.js#L109) within the Lightning component.
- The scan and it's results are [stored in custom objects](https://github.com/muenzpraeger/salesforce-einstein-object-detection-mobile-example/blob/f8adea0a9a0a5ac4f5d38d9ae1b6ed7953a74a28/force-app/main/default/classes/ShelfScanner.cls#L11) for later analysis.


## Contribution

Feel free to contribute to this project via pull requests.

## License

For licensing see the included [license file](https://github.com/muenzpraeger/salesforce-einstein-object-detection-mobile-example/blob/master/LICENSE.md).
