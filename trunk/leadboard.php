<?php require_once("classes/manager/RodneyManager.php"); ?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>RODNEY - Slashware Interactive</title>
        <link href="game.css" rel="stylesheet" type="text/css" />
        <script type="text/javascript" src="js/leadboard.js?v=6"></script>
        <?php
            $scores = RodneyManager::getTopScores(10);
        ?>
    </head>
    
    <body>
        <div align="center">
            <table style="width: 500px;" class="gridtable">
                <tr>
                    <th align="center" colspan="3">HIGH SCORES</th>
                </tr>
                
                <tr>
                    <th width="200">Name</th>
                    <th width="200">Date</th>
                    <th width="100">Score</th>
                </tr>
                
                <?php for ($i=0;$i<sizeof($scores);$i++){ ?>
                    <?php $sc = json_decode($scores[$i][0]); ?>
                    <tr>
                        <td><? echo $sc->{"name"} ?></td>
                        <td><? echo $scores[$i][1]; ?></td>
                        <td><? echo $sc->{"score"}; ?></td>
                    </tr>
                <?php } ?>
            </table>
            
            <br />
            <input type="button" value="Return to Rodney" onclick="location.href='index.html'" />
        </div>
    </body>
</html>
