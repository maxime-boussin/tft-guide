$(document).ready(function () {
    loadHome();
});
function loadHome() {
    $("#main").html("");
    $.getJSON("ressources/champions.json", function (data) {
        $.each(data, function (key, val) {
            $("#main").append("\
            <div class='col-md-1'>\n\
            <a href='#' onclick='details(\"" + key + "\")'>\n\
            <img class='champ-thumb red-tooltip' src='https://opgg-static.akamaized.net/images/lol/champion/" + key + ".png?image=w_60&v=1' data-toggle='tooltip' title='" + key + "'>\
            </a></div>");
        });
        $("#main").append("</div>");
        $('[data-toggle="tooltip"]').tooltip();
    });
}
function details(champion) {
    $.getJSON("ressources/champions.json", function (data) {
        desc = data[champion];
        $("#detailsModalTitle").html(champion);
        html = "<div class='container-fluid'><div class='col-md-4' id='modalChampImg'><img class='champ-thumb' src='https://opgg-static.akamaized.net/images/lol/champion/" + champion + ".png?image=w_140&v=1'></div>";
        html += "<div class='col-md-4' id='modalChampClasses'>";
        html += "<div class='col-md-6'><div class='row'>" + desc.cost + " <i class='fas fa-coins prs-yellow' data-toggle='tooltip' title='Price'></i></div><div class='row top-buffer'>";
        $.each(desc.class, function (key, val) {
            html += "<img class='round-icon' src='https://cdn.lolchess.gg/images/tft/traiticons-white/trait_icon_" + val.toLowerCase() + ".png' data-toggle='tooltip' title='" + val + "'>";
        });
        html += "</div><div class='row top-buffer'>";
        $.each(desc.origin, function (key, val) {
            html += "<img class='round-icon' src='https://cdn.lolchess.gg/images/tft/traiticons-white/trait_icon_" + val.toLowerCase() + ".png' data-toggle='tooltip' title='" + val + "'>";
        });
        html += "</div></div><div class='col-md-6 text-center'>";
        html += "<div id='probaTitle' data-toggle='collapse' data-target='.rowsProba'><i class='fas fa-dice prs-blue' data-toggle='tooltip' title='Probability'></i></div>";
        html += "<div class='collapse rowsProba'>";
        html += "<table id='tableProba' class='table'>";
        iPrice = 0;
        $.each(data, function (key, champData) {
            if (champData.cost === desc.cost) {
                iPrice++;
            }
        });
        var req = $.getJSON("ressources/probabilities.json", function (probas) {
            globalProbas = probas.probabilities[desc.cost - 1];
            for (var level in globalProbas) {
                var probaUnique = globalProbas[level] / iPrice;
                res = 0;
                perRestant = 100;
                for (var i = 0; i < 5; i++) {
                    res += probaUnique * perRestant / 100;
                    perRestant -= res;
                }
                probaUnique = Math.round((res) * 100) / 100;
                html += "<tr class='rowProba'><td scope='col'>" + level + "</td><td>" + probaUnique + "%</td></tr>";
            }
        });

        req.done(function (response) {
            html += "<tr class='rowProba'><td><i class='fas fa-question-circle' data-toggle='tooltip' data-html='true' data-placement='bottom' title='Probabilities to have <b>1 champion</b> on a reroll, sort by summoner&#39;s level.'></i></td></tr>";
            html += "</table></div></div></div>";
            html += "<div class='col-md-4'  id='modalChampStats'><div class='col-md-6'>";
            html += "<p><i class='fas fa-heart prs-green' data-toggle='tooltip' title='Health'></i> " + desc.stats.defense.health + "</p>";
            html += "<p><i class='fas fa-shield-alt prs-blue' data-toggle='tooltip' title='Armor'></i> " + desc.stats.defense.armor + "</p>";
            html += "<p><i class='fas fa-hat-wizard prs-purple' data-toggle='tooltip' title='Magic resist'></i> " + desc.stats.defense.magicResist + "</p>";
            html += "</div><div class='col-md-6'>";
            html += "<p><i class='fas fa-bolt prs-yellow' data-toggle='tooltip' title='Attack speed'></i> " + desc.stats.offense.attackSpeed + "</p>";
            html += "<p><i class='fas fa-burn prs-red' data-toggle='tooltip' title='Damages'></i> " + desc.stats.offense.damage + "</p>";
            html += "<p><i class='fas fa-bullseye prs-blue' data-toggle='tooltip' title='Range'></i> " + desc.stats.offense.range + "</p>";
            html += "</div></div></div>";
            $("#switchModalTabButton").html("Ability");
            $("#switchModalTabButton").attr("onclick", "switchModalTab()");
            $("#detailsModalBody").html(html);
            $("#detailsModal").modal();
            $('[data-toggle="tooltip"]').tooltip();
        });
    });
}
function switchModalTab(index = 0) {
    $.getJSON("ressources/champions.json", function (data) {
        champion = $("#detailsModalTitle").html();
        desc = data[champion].ability;

        skillLabel = desc.name.replace(/[&\/\\#,+()$~%. '":*?<>{}!]/g, '').toLowerCase();
        skillImg = "<img class='skill-thumb pull-right' src='https://cdn.lolchess.gg/images/tft/champion-skills/" + champion.toLowerCase() + "_" + skillLabel + ".png'>";

        classes = "<h4>" + desc.name + "</h4>";
        classes += "<p>" + desc.description + "</p>";
        if (desc.type === "Passive") {
            stats = "<p>Passive skill</p>";
        } else {
            manaPer = (desc.manaStart / desc.manaCost) * 100;
            stats = "<div class='progress centerText'><div class='progress-bar' role='progressbar' style='width: " + manaPer + "%;' aria-valuenow='" + desc.manaStart + "' aria-valuemin='0' aria-valuemax='" + desc.manaCost + "'>" + (manaPer === 0 ? "</div>" + desc.manaStart + "/" + desc.manaCost : desc.manaStart + "/" + desc.manaCost + "</div>") + "</div>";
        }
        stats += "<p>" + desc.stats[index].type + " :</p><div class='row'>";
        $.each(desc.stats[index].value.split(' / '), function (key, val) {
            stats += "<div class='col-md-4'><div class='row centerText'>";
            for (i = 0; i <= key; i++) {
                stats += "<i class='fas fa-star prs-yellow'></i>";
            }
            stats += "</div><div class='row centerText'>" + val + "</div>";
            stats += "</div>";
        });
        stats += "</div>";
        if (desc.stats.length > 1) {
            stats += "<div class='row'><nav>\n\
            <ul class='pagination pagination-sm'>";
            for (i = 0; i < desc.stats.length; i++) {
                stats += "<li class='page-item " + (i === index ? "disabled" : "") + "'><a class='page-link' href='#' onclick='switchModalTab(" + i + ")'" + (i === index ? "tabindex='-1'" : "") + ">" + (i + 1) + "</a></li>";
            }
            stats += "</ul></nav></div>";
        }
        $("#switchModalTabButton").html("Stats");
        $("#switchModalTabButton").attr("onclick", "details('" + champion + "')");
        $("#modalChampImg").html(skillImg);
        $("#modalChampStats").html(stats);
        $("#modalChampClasses").html(classes);
    });
}

function sortChampions(sorting) {
    var categories = [];
    var html = "";
    var tooltipCateg = [];
    $.getJSON("ressources/" + sorting + ".json", function (data) {
        $.each(data, function (key, categJson) {
            categories.push(key);
            if (typeof (categJson.description) === "string") {
                currentTooltipCateg = categJson.description.replace(/'/g, '&#39;') + "<br>";
            } else {
                currentTooltipCateg = "";
            }
            categJson.bonuses.forEach(function (bonus) {
                currentTooltipCateg += "<b>" + bonus.needed + "</b> - " + bonus.effect.replace(/'/g, '&#39;') + "<br>";
            });
            tooltipCateg[key] = currentTooltipCateg;
        });
    });
    var req = $.getJSON("ressources/champions.json", function (data) {
        $.each(categories, function (keyCat, categorie) {
            categorieUpper = firstUpper(categorie);
            html += "<h3><img class='round-icon' src='https://cdn.lolchess.gg/images/tft/traiticons-white/trait_icon_" + categorie + ".png' data-html='true' data-placement='right' data-toggle='tooltip' title='" + tooltipCateg[categorie] + "'>";
            html += categorieUpper + "</h3><hr>";
            var i = 0;
            $.each(data, function (keyChamp, champ) {
                if (i === 0) {
                    html += "<div class='row'>";
                }
                if (champ.class.includes(categorieUpper) || champ.origin.includes(categorieUpper)) {
                    html += "\
                    <div class='col-md-1'>\n\
                    <a href='#' onclick='details(\"" + keyChamp + "\")'>\n\
                    <img class='champ-thumb red-tooltip' src='https://opgg-static.akamaized.net/images/lol/champion/" + keyChamp + ".png?image=w_60&v=1' data-html='true' data-toggle='tooltip' title='" + keyChamp + "'>\
                    </a></div>";
                }
                if (Object.keys(data).length - 1 === i) {
                    html += "</div>";
                }
                i++;
            });
        });
        req.done(function (response) {
            $("#main").html(html);
            $('[data-toggle="tooltip"]').tooltip();
        });
    });
}
function firstUpper(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}