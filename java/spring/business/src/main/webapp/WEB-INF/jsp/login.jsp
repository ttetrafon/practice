<html>

<head>
<title>First Web Application</title>
</head>

<body>
    <form method="post">
        Name : <input type="text" name="name" />
        Password : <input type="password" name="password" />
        <input type="submit" />
    </form>
    <font color="red">${errorMessage}</font>
    <div>Version: ${version}</div>
</body>

</html>
