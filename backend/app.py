import base64
from flask import Flask, request
import camelot.io as camelot
import numpy as np
import pandas as pd
import mysql.connector
import tempfile
import os

from flask_cors import CORS

def get_connection():
    mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="student_data"
    )
    return mydb

def insert_query(table,subject_name):
    try:
        db=get_connection()
        cursor=db.cursor()
    except Exception as e:
        return {"status": False,"data":"","massage":"Database Error!"}


    query=f"CREATE TABLE IF NOT EXISTS {subject_name} (seat_no varchar(255) PRIMARY KEY,marks varchar(255));"
    cursor.execute(query)

    try:
        query=f"INSERT INTO subject_list VALUES('{subject_name}','EXTC');"
        cursor.execute(query)
    except:
        pass

    for i in table:
        for j in i:
            x=j.split('  ')
            if (len(x)>1) and x[1]!=' Marks/Grade Seat No':
                seat_no=x[0]
                mark=0.0

                if(x[1]==' (AB)'):
                    mark=0.0
                else:
                    mark=float(x[1])
                
                try:
                    query=f"insert into {subject_name} (seat_no,marks) values('{seat_no}',{mark})"
                    cursor.execute(query)
                except Exception as e:
                    print("error :",e)
                    pass

    cursor.execute('select * from student_result')
    res=cursor.fetchall()

    print("result :",res)
    db.commit()
    cursor.close()

    return {"status": True,"data":"","massage":"Result Data Added!"}


app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_pdf():
    print("post request received....")

    try:
        pdf_data = request.files['file']
        pdf_data.save('marks.pdf')

        tables = camelot.read_pdf('marks.pdf') 
        table1=np.array(tables[0].df)
        table2=np.array(tables[1].df)
        table2=table2.transpose()

        subject_name=table1[2][1].split("\n")[0].split("-")[1].strip().replace(" ","_")
        print(f"sobject name :{subject_name}:")
        
        return insert_query(table2,subject_name)

    except Exception as e:
        print("error :",e)
        return {"status": False,"data":"","massage":"Uknown error occured!"}


@app.route('/login', methods=['POST'])
def handleLogin():
    print("login request received....")

    userCreads = request.get_json()
    username=userCreads['username']
    password=userCreads['password']
    role=userCreads['role']

    try:
        db=get_connection()
        cursor=db.cursor()

        query=f"select * from user_data where username='{username}';"
        cursor.execute(query)
        query_result=cursor.fetchall()
        print(len(query_result))

        if(len(query_result)>=1):
            print(query_result[0][1])
            if(password==query_result[0][1]):
                if(role==query_result[0][2]):
                    return {"status": True,"data":"","massage":"Logged In!"}
                else:
                    return {"status": False,"data":"","massage":"Role Doesnt Match!"}
            else:
                return {"status": False,"data":"","massage":"Wrong Password!"}
        else:
            return {"status": False,"data":"","massage":"User Not Found!"}
        
    except Exception as e:
        print("error :",e)
        return {"status": False,"data":"","massage":"Uknown error occured!"}



@app.route('/getStudentResult', methods=['GET'])
def getStudentResult():
    print("get student marks request received....")
    roll_no = request.args.get('roll_no')


    try:
        db=get_connection()
        cursor=db.cursor()

        query=f"select subject_name from subject_list;"
        cursor.execute(query)

        subject_list=cursor.fetchall()

        print("subject list :",type(subject_list))

        result_arr=[]
        for subject in subject_list:
            subject_name=subject[0]
            query=f"select marks from {subject_name} where seat_no='{roll_no}';"
            cursor.execute(query)
            # print(f" {subject_name} : {cursor.fetchone()[0]} :{roll_no}")

            result={
                "subject_name":subject_name,
                "mark":cursor.fetchone()[0]
            }

            result_arr.append(result)
        print("result array :",result_arr)
        return {"status": True,"data":result_arr,"massage":"Student Result Fetched!"}

    except Exception as e:
        print("error :",e)
        return {"status": False,"data":"","massage":"Uknown error occured!"}



            
if __name__ == '__main__':
    app.run()
