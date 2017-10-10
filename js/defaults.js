define(["underscore"], function (_) {

    return {
        width: 192, height: 192, showControls: false,
        renderArea: true, renderLabel: true, renderTitle: true,
        elasticY: true, elasticX: true,
        margins: {top: 20, right: 20, bottom: 20, left: 30},
        brushOn: true, transitionDuration: 500,
        required: ["dimension", "measure", "reducer"],
        x_colors: ['#ccc', '#E2F2FF', '#C4E4FF', '#9ED2FF', '#81C5FF', '#6BBAFF', '#51AEFF', '#36A2FF', '#1E96FF', '#0089FF', '#0061B5'],
    }
});