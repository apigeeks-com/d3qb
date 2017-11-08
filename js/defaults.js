define(["underscore"], function (_) {

    return {
        width: 192, height: 192, showControls: false,
        renderArea: true, renderLabel: true, renderTitle: true,
        elasticY: true, elasticX: true,
        margins: {top: 15, right: 15, bottom: 15, left: 15},
        brushOn: true, transitionDuration: 1000,
        required: ["dimension", "measure", "reducer"],
        x_colors: ['#ccc'],
    }
});
