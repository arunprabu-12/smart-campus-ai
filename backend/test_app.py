import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Testing API...")
    
    # 1. Test Departments & Regulations (used for registration)
    try:
        depts = requests.get(f"{BASE_URL}/admin/departments").json()
        regs = requests.get(f"{BASE_URL}/admin/regulations").json()
        print(f"[OK] Fetched {len(depts)} departments and {len(regs)} regulations.")
    except Exception as e:
        print(f"[ERROR] Could not fetch departments: {e}")
        return

    if not depts or not regs:
        print("[ERROR] Database not seeded with departments or regulations!")
        return

    dept_id = depts[0]['id']
    reg_id = regs[0]['id']

    # 2. Test Registration
    email = "test_user_999@college.edu"
    payload = {
        "full_name": "Test User",
        "register_number": "TEST999",
        "college_email": email,
        "password": "password123",
        "department_id": dept_id,
        "regulation_id": reg_id,
        "admission_year": 2023,
        "current_semester": 1,
        "section": "A",
        "career_interest": "Testing"
    }

    try:
        reg_res = requests.post(f"{BASE_URL}/auth/register", json=payload)
        if reg_res.status_code == 200:
            print("[OK] Registration successful.")
        elif reg_res.status_code == 400 and "already registered" in reg_res.text:
            print("[OK] User already registered, continuing to login.")
        else:
            print(f"[ERROR] Registration failed: {reg_res.status_code} - {reg_res.text}")
    except Exception as e:
        print(f"[ERROR] Registration exception: {e}")
        return

    # 3. Test Login
    try:
        login_payload = {"college_email": email, "password": "password123"}
        login_res = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
        if login_res.status_code == 200:
            token = login_res.json()["access_token"]
            print("[OK] Login successful.")
        else:
            print(f"[ERROR] Login failed: {login_res.status_code} - {login_res.text}")
            return
    except Exception as e:
        print(f"[ERROR] Login exception: {e}")
        return

    # 4. Test Dashboard (Graphs data)
    headers = {"Authorization": f"Bearer {token}"}
    try:
        dash_res = requests.get(f"{BASE_URL}/students/me/dashboard", headers=headers)
        if dash_res.status_code == 200:
            dash_data = dash_res.json()
            # check if graphs data exists
            print(f"[OK] Dashboard fetched. SGPA trends length: {len(dash_data.get('sgpa_trend', []))}")
        else:
            print(f"[ERROR] Dashboard fetch failed: {dash_res.status_code} - {dash_res.text}")
    except Exception as e:
        print(f"[ERROR] Dashboard exception: {e}")

    # 5. Test Question Bank (Docx assignments and tests)
    try:
        qb_assign = requests.get(f"{BASE_URL}/question-bank/assignments")
        if qb_assign.status_code == 200:
            print(f"[OK] Question Bank Assignments fetched: {len(qb_assign.json())} courses found.")
        else:
            print(f"[ERROR] Question bank assignments failed: {qb_assign.status_code}")

        qb_tests = requests.get(f"{BASE_URL}/question-bank/tests")
        if qb_tests.status_code == 200:
            print(f"[OK] Question Bank Tests fetched: {len(qb_tests.json())} courses found.")
        else:
            print(f"[ERROR] Question bank tests failed: {qb_tests.status_code}")
    except Exception as e:
        print(f"[ERROR] Question bank exception: {e}")

if __name__ == "__main__":
    run_tests()
