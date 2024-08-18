export async function getSettings(){
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");

    const response = await fetch(`https://philippk.name/ToDoApp/getSettings.php?user_id=${userId}&username=${encodeURIComponent(username)}`, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    let data = {};
    try {
        data = await response.json();
    } catch (error) {
        console.error('Fehler beim Parsen der JSON-Antwort:', error);
        return;
    }

    if(!data){
        return console.log("Keine Einstellungen hinterlegt.")
    }

    if(data.notifications){
        localStorage.setItem("notificationSetting", true);
    } else if (!data.notifications) {
        localStorage.setItem("notificationSetting", false);
    }

    if(data.intervalLength){
        localStorage.setItem("intervalLength", data.intervalLength);
    } else if (!data.intervalLength){
        localStorage.setItem("intervalLength", 3600000)
    }
};