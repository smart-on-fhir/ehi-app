INSERT INTO "users" ("id","username","password","role") VALUES 
(1, 'admin'  , '$2a$10$ZyXp2reLAbPDwNIIqzurIujWmp4bayMnJbSno0ucqEaV1SXbdxZTa', 'admin'), -- Password: admin-password
(2, 'patient', '$2a$10$ZyXp2reLAbPDwNIIqzurIuJMtKgr34Wh3QeG21sjDflZvp5VWy1qm', 'user' ); -- Password: patient-password


INSERT INTO "institutions" ("displayName","fhirUrl","location","disabled","clientId","scope") VALUES 
('New York Gerontology Hospital'     , 'https://ehi-server.herokuapp.com/fhir', '211 Shortsteel Blvd New York, NY 10001', 0, 'test_client_id', 'offline_access patient/$ehi-export'),
('Fana Darber'                       , 'http://example.com/fhir'              , NULL                                    , 1, 'test_client_id', 'offline_access patient/$ehi-export'),
('Journey Assessments'               , 'http://example.com/fhir'              , NULL                                    , 1, 'test_client_id', 'offline_access patient/$ehi-export'),
('Billows Medicine'                  , 'http://example.com/fhir'              , NULL                                    , 1, 'test_client_id', 'offline_access patient/$ehi-export'),
('Gram Typical Young Health'         , 'http://example.com/fhir'              , NULL                                    , 1, 'test_client_id', 'offline_access patient/$ehi-export');
