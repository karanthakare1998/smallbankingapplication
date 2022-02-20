
from flask import Flask, render_template, request,redirect
import urllib.request, json
import sqlite3
#for DATE - TIME
import datetime
from datetime import datetime as dt
from dateutil.relativedelta import relativedelta
from datetime import timedelta

app = Flask(__name__)



@app.route("/")
def home():
    page_name="HOME"
    input_date=""
    ID=0
    return render_template("index.html",page_name=page_name,input_date=input_date,ID=ID);

@app.route("/transactions/<input_date>")
def transactions(input_date):
    page_name="TRANSACTION"
    ID=0
    return render_template("index.html",page_name=page_name,input_date=input_date,ID=ID);

@app.route("/balance/<input_date>")
def balance(input_date):
    page_name="BALANCE"
    ID=0
    return render_template("index.html",page_name=page_name,input_date=input_date,ID=ID);

@app.route("/add")
def add():
    page_name="ADD"
    input_date=""
    ID=0
    return render_template("index.html",page_name=page_name,input_date=input_date,ID=ID);

@app.route("/details/<ID>")
def details(ID):
    page_name="DETAILS"
    input_date="" 
    return render_template("index.html",page_name=page_name,input_date=input_date,ID=ID);

@app.route("/SHOW_ALL_ACC_DATA.do",methods = ["GET"])
def SHOW_ALL_ACC_DATA():
    print("SHOW_ALL_ACC_DATA")
    Outsider_Dict={}
    k=0
    with urllib.request.urlopen("https://s3-ap-southeast-1.amazonaws.com/he-public-data/bankAccountdde24ad.json") as url:
        data = json.loads(url.read().decode())

    for i in data:
        Outsider_Dict[k]=i
        k=k+1

    print(Outsider_Dict)

    return Outsider_Dict;

@app.route("/FILTER_DATE_WISE.do",methods = ["POST"] )
def FILTER_DATE_WISE():
    print("FILTER_DATE_WISE")
    Outsider_Dict={}
    k=0
    with urllib.request.urlopen("https://s3-ap-southeast-1.amazonaws.com/he-public-data/bankAccountdde24ad.json") as url:
        jsondate = json.loads(url.read().decode())

    searcheddate=request.data.decode()

    for i in jsondate:
        if(str(dt.strptime(i["Date"],'%d %b %y').strftime('%Y-%m-%d'))==str(searcheddate)):
            Outsider_Dict[k]=i
            k=k+1

    return Outsider_Dict;


@app.route("/FETCH_TRANSACTION_DATA.do",methods = ["POST"] )
def FETCH_TRANSACTION_DATA():
    print("FETCH_TRANSACTION_DATA")
    Outsider_Dict={}
    k=0
    with urllib.request.urlopen("https://s3-ap-southeast-1.amazonaws.com/he-public-data/bankAccountdde24ad.json") as url:
        jsondate = json.loads(url.read().decode())

    try:
        searcheddate=str(dt.strptime(request.data.decode(),'%d-%m-%y').strftime('%Y-%m-%d'))
    except Exception as e:
        searcheddate=str(dt.strptime(request.data.decode(),'%d-%m-%Y').strftime('%Y-%m-%d'))

    for i in jsondate:
        if(str(dt.strptime(i["Date"],'%d %b %y').strftime('%Y-%m-%d'))==searcheddate):
            Outsider_Dict[k]=i
            k=k+1
    return Outsider_Dict;


@app.route("/SUBMIT_FORM.do",methods = ["POST"] )
def SUBMIT_FORM():
    print("SUBMIT_FORM")
    Outsider_Dict={}
    Outsider_Dict['issuccess']=False;
    Outsider_Dict['mesg']='';

    con = sqlite3.connect("storage.db")
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    data = json.loads(request.data.decode())
    ADD_ACCOUNT="INSERT INTO account_table (accno,date,valuedate,txndetail,WA,DA,BA) VALUES(?,?,?,?,?,?,?)"

    try:
        cur.execute(ADD_ACCOUNT,(data.get("accno"),data.get("date"),data.get("valuedate"),data.get("details"),data.get("WA"),data.get("DA"),data.get("BalanceAmt")))
        Outsider_Dict['issuccess']=True;
        Outsider_Dict['mesg']='Data Added Successfully.';
        con.commit()
    except Exception as e:
        Outsider_Dict['issuccess']=False;
        Outsider_Dict['mesg']=e;
        con.rollback()

    return Outsider_Dict;

@app.route("/FETCH_ADDED_DATA.do",methods = ["GET"])
def FETCH_ADDED_DATA():
    print("FETCH_ADDED_DATA")
    Insider_Dict = {}
    Outsider_Dict={}
    i=0
    con = sqlite3.connect("storage.db")
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    FETCH_ADDED_TABLE_DATA="SELECT * FROM account_table"
    cur.execute(FETCH_ADDED_TABLE_DATA)
    DATA = cur.fetchall()
    for each in DATA:
        Insider_Dict['id']=each[0]
        Insider_Dict['accno']=each[1]
        Insider_Dict['date']=each[2]
        Insider_Dict['valuedate']=each[3]
        Insider_Dict['txndetail']=each[4]
        Insider_Dict['WA']=each[5]
        Insider_Dict['DA']=each[6]
        Insider_Dict['BA']=each[7]
        Outsider_Dict[i]=Insider_Dict
        Insider_Dict = {}
        i=i+1
    return Outsider_Dict;

@app.route("/FETCH_ADDED_DATA_USEING_ID.do",methods = ["POST"])
def FETCH_ADDED_DATA_USEING_ID():
    print("FETCH_ADDED_DATA_USEING_ID")
    Insider_Dict = {}
    Outsider_Dict={}
    i=0
    con = sqlite3.connect("storage.db")
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    FETCH_ADDED_TABLE_DATA="SELECT * FROM account_table where id=?"
    cur.execute(FETCH_ADDED_TABLE_DATA,(str(request.data.decode()),))
    DATA = cur.fetchall()
    for each in DATA:
        Insider_Dict['id']=each[0]
        Insider_Dict['accno']=each[1]
        Insider_Dict['date']=each[2]
        Insider_Dict['valuedate']=each[3]
        Insider_Dict['txndetail']=each[4]
        Insider_Dict['WA']=each[5]
        Insider_Dict['DA']=each[6]
        Insider_Dict['BA']=each[7]
        Outsider_Dict[i]=Insider_Dict
        Insider_Dict = {}
        i=i+1
    return Outsider_Dict;

if __name__ == '__main__':
   app.run(debug = True)
