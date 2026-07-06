Dim http, jsonStr, url

url = "http://localhost:3000/api/scada-alarm"

jsonStr = "{""machineId"":""Motor_01"", ""errorDetails"":""Overheating detected: Temperature above 85 celcius degrees"", ""priority"":""High""}"

Set http = CreateObject("MSXML2.ServerXMLHTTP")
http.Open "POST", url, False
http.setRequestHeader "Content-Type", "application/json"
http.send jsonStr

' Removing the flag to not re-send the request over and over
$Alarm_Triggered = 1
Set http = Nothing