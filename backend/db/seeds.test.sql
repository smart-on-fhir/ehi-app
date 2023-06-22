INSERT INTO "users" ("id","username","password","role") VALUES 
(1, 'admin'  , '$2a$10$ZyXp2reLAbPDwNIIqzurIujWmp4bayMnJbSno0ucqEaV1SXbdxZTa', 'admin'), -- Password: admin-password
(2, 'patient', '$2a$10$ZyXp2reLAbPDwNIIqzurIuJMtKgr34Wh3QeG21sjDflZvp5VWy1qm', 'user' ); -- Password: patient-password


INSERT INTO "institutions" ("id","displayName","fhirUrl","location","disabled","clientId","scope") VALUES 
(1, 'Institution 1', 'Institution 1 url', 'Institution 1 location', 0, 'institution_1_client_id', 'offline_access patient/$ehi-export'),
(2, 'Institution 2', 'Institution 2 url', 'Institution 2 location', 0, 'institution_2_client_id', 'offline_access patient/$ehi-export'),
(3, 'Institution 3', 'Institution 3 url', 'Institution 3 location', 1, 'institution_3_client_id', 'offline_access patient/$ehi-export'),
(4, 'Institution 4', 'Institution 4 url', 'Institution 4 location', 1, 'institution_4_client_id', 'offline_access patient/$ehi-export'),
(5, 'Institution 5', 'Institution 5 url', 'Institution 5 location', 1, 'institution_5_client_id', 'offline_access patient/$ehi-export'),
(6, 'Institution 6', 'Institution 6 url', 'Institution 6 location', 1, 'institution_6_client_id', 'offline_access patient/$ehi-export');


INSERT INTO "jobs" (
    "id",
    "userId",
    "patientId",
    "statusUrl",
    "readonly",
    "customizeUrl",
    "manifest",
    "parameters",
    "authorizations",
    "attachments",
    "createdAt",
    "accessToken",
    "refreshToken",
    "tokenUri",
    "status",
    "patientName"
) VALUES (
    -- id
    1,
    
    -- userId (admin)
    1,

    -- patientId
    'sample_patient_id',
    
    -- statusUrl
    'http://ehi-server.org/jobs/remote-job-1-id/status',
    
    -- readonly
    1,
    
    -- customizeUrl
    'http://ehi-server.org/jobs/remote-job-1-id/customize?behavior=automatic&_patient=6c5d9ca9-54d7-42f5-bfae-a7c19cd217f2',

    -- manifest
    '{
        "transactionTime": "2023-06-15T14:33:59.289Z",
        "requiresAccessToken": true,
        "output": [
            {
                "type": "Patient",
                "url": "http://ehi-server.org/jobs/remote-job-1-id/download/Patient",
                "count": 1
            },
            {
                "type": "Organization",
                "url": "http://ehi-server.org/jobs/remote-job-1-id/download/Organization",
                "count": 3
            },
            {
                "type": "Practitioner",
                "url": "http://ehi-server.org/jobs/remote-job-1-id/download/Practitioner",
                "count": 3
            },
            {
                "type": "Observation",
                "url": "http://ehi-server.org/jobs/remote-job-1-id/download/Observation",
                "count": 66
            }
        ],
        "error": [],
        "extension": {
            "metadata": "http://ehi-server.org/jobs/remote-job-1-id/metadata"
        }
    }',
    
    -- parameters
    '{
        "visits": {
            "name": "Clinic Visits",
            "enabled": false,
            "notes": ""
        },
        "labs": {
            "name": "Lab Reports",
            "enabled": false,
            "notes": ""
        },
        "billing": {
            "name": "Billing Records",
            "enabled": false,
            "notes": ""
        },
        "medicalRecord": {
            "name": "Other Records",
            "enabled": false,
            "notes": ""
        },
        "dischargeSummary": {
            "name": "Discharge Summary",
            "enabled": false,
            "notes": ""
        },
        "operative": {
            "name": "Operative Reports",
            "enabled": false,
            "notes": ""
        },
        "pathology": {
            "name": "Pathology Reports",
            "enabled": false,
            "notes": ""
        },
        "radiology": {
            "name": "Radiology Reports",
            "enabled": false,
            "notes": ""
        },
        "photographs": {
            "name": "Photographs",
            "enabled": false,
            "notes": ""
        },
        "other": {
            "name": "Other",
            "enabled": false,
            "notes": ""
        }
    }',
    
    -- authorizations
    '{
        "hiv": {
            "name": "HIV test results",
            "value": false
        },
        "alcoholAndDrug": {
            "name": "Alcohol and Drug Abuse Records",
            "value": false
        },
        "mentalHealth": {
            "name": "Details of Mental Health Diagnosis and/or Treatment",
            "value": false
        },
        "confidential": {
            "name": "Confidential Communications with a Licensed Social Worker",
            "value": false
        },
        "domesticViolence": {
            "name": "Details of Domestic Violence Victims Counseling",
            "value": false
        },
        "sexualAssault": {
            "name": "Details of Sexual Assault Counseling",
            "value": false
        },
        "genetic": {
            "name": "Genetic Screening",
            "value": false
        },
        "other": {
            "name": "Other(s)",
            "value": false
        }
    }',
    
    -- attachments
    '[]',

    -- createdAt
    '2023-06-15 21:02:00',

    -- accessToken
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6Im9mZmxpbmVfYWNjZXNzIHBhdGllbnQvJGVoaS1leHBvcnQiLCJpYXQiOjE2ODc0NTE0MzcsImV4cCI6MTY4NzQ1NTAzN30.xRFrJgOl7etW6dexg-LqKYBfmw57_r4uPWtaemZbYic',
    
    -- refreshToken
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7Im5lZWRfcGF0aWVudF9iYW5uZXIiOnRydWUsInBhdGllbnQiOiI2YzVkOWNhOS01NGQ3LTQyZjUtYmZhZS1hN2MxOWNkMjE3ZjIifSwic2NvcGUiOiJvZmZsaW5lX2FjY2VzcyBwYXRpZW50LyRlaGktZXhwb3J0IiwiaWF0IjoxNjg3NDUxNDM3LCJleHAiOjE3MTg5ODc0Mzd9.WumcPRqIRo7__hMVvVStRRLIs2TnV2l9OkKPAfQKM-c',

    -- tokenUri
    'http://127.0.0.1:8888/auth/token',

    -- status
    'approved',
    
    -- patientName
    'Mr. Abram Lemke'
),
(
    -- id
    2,

    -- userId (patient)
    2,

    -- patientId
    'sample_patient_id',

    -- statusUrl
    '',

    -- readonly
    1,

    -- customizeUrl
    '',

    -- manifest
    '{
        "transactionTime": "2023-06-15T14:33:59.289Z",
        "requiresAccessToken": true,
        "output": [
            {
                "type": "Patient",
                "url": "http://ehi-server.org/jobs/remote-job-2-id/download/Patient",
                "count": 1
            },
            {
                "type": "Organization",
                "url": "http://ehi-server.org/jobs/remote-job-2-id/download/Organization",
                "count": 3
            },
            {
                "type": "Practitioner",
                "url": "http://ehi-server.org/jobs/remote-job-2-id/download/Practitioner",
                "count": 3
            },
            {
                "type": "Observation",
                "url": "http://ehi-server.org/jobs/remote-job-2-id/download/Observation",
                "count": 66
            }
        ],
        "error": [],
        "extension": {
            "metadata": "http://ehi-server.org/jobs/remote-job-2-id/metadata"
        }
    }',

    -- parameters
    '{
        "visits": {
            "name": "Clinic Visits",
            "enabled": false,
            "notes": ""
        },
        "labs": {
            "name": "Lab Reports",
            "enabled": false,
            "notes": ""
        },
        "billing": {
            "name": "Billing Records",
            "enabled": false,
            "notes": ""
        },
        "medicalRecord": {
            "name": "Other Records",
            "enabled": false,
            "notes": ""
        },
        "dischargeSummary": {
            "name": "Discharge Summary",
            "enabled": false,
            "notes": ""
        },
        "operative": {
            "name": "Operative Reports",
            "enabled": false,
            "notes": ""
        },
        "pathology": {
            "name": "Pathology Reports",
            "enabled": false,
            "notes": ""
        },
        "radiology": {
            "name": "Radiology Reports",
            "enabled": false,
            "notes": ""
        },
        "photographs": {
            "name": "Photographs",
            "enabled": false,
            "notes": ""
        },
        "other": {
            "name": "Other",
            "enabled": false,
            "notes": ""
        }
    }',

    -- authorizations
    '{
        "hiv": {
            "name": "HIV test results",
            "value": false
        },
        "alcoholAndDrug": {
            "name": "Alcohol and Drug Abuse Records",
            "value": false
        },
        "mentalHealth": {
            "name": "Details of Mental Health Diagnosis and/or Treatment",
            "value": false
        },
        "confidential": {
            "name": "Confidential Communications with a Licensed Social Worker",
            "value": false
        },
        "domesticViolence": {
            "name": "Details of Domestic Violence Victims Counseling",
            "value": false
        },
        "sexualAssault": {
            "name": "Details of Sexual Assault Counseling",
            "value": false
        },
        "genetic": {
            "name": "Genetic Screening",
            "value": false
        },
        "other": {
            "name": "Other(s)",
            "value": false
        }
    }',

    -- attachments
    '[]',

    -- createdAt
    '2023-06-15 21:02:00',

    -- accessToken
    '',

    -- refreshToken
    '',

    -- tokenUri
    'http://ehi-server.org/auth/token',

    -- status
    'approved',

    -- patientName
    'Mr. Abram Lemke'
);
