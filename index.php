<?php

/** @var Connection $connection */
$connection = require_once './database/pdo.php';

// read notes in from the database
$notes = $connection->getNotes();

$currentNote = [
    'id' => '',
    'title' => '',
    'description' => ''
];

if (isset($_GET['id'])) {
    $currentNote = $connection->getNoteById($_GET['id']);
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sticky Notes</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
    <link rel="stylesheet" href="./css/notes.css">
</head>

<body class="w-full bg-cork-board">
    <div id="notes-app">

        <nav class="sticky top-0 z-50 w-full">
            <button class="p-5 bg-orange-900 shadow-lg text-4xl font-bold text-yellow-300 hover:text-yellow-100 w-full" v-on:click="adding = !adding">+</button>
            <note-editor v-show="showEditor" info="<?php echo htmlspecialchars(json_encode($currentNote)); ?>" :last_id="<?php echo isset(reset($notes)['id']) ? reset($notes)['id'] : 0; ?>">
            </note-editor>
        </nav>

        
        <div class="flex flex-wrap flex-row justify-center w-4/5 mx-auto items-start">
            <?php foreach ($notes as $note): ?>
                <sticky-note info="<?php echo htmlspecialchars(json_encode($note)); ?>">
                </sticky-note>
            <?php endforeach; ?>
        </div>
    </div>

    <script src="./vue/notesapp.js"></script>
    
</body>

</html>
