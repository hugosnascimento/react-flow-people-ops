-- INSTRUCTIONS:
-- 1. Go to Supabase Authentication > Users and copy your User UID.
-- 2. Replace 'YOUR_USER_ID_HERE' matches or use the specific ID below.
-- 3. Run this script in the Supabase SQL Editor to RESET and REPOPULATE orchestrators.

DELETE FROM public.orchestrators;

INSERT INTO public.orchestrators (user_id, id, name, description, status, execution_health, error_count, last_execution, nodes, edges)
VALUES
(
    'b0e3cd88-f190-4a23-a6c8-bbd3ff6aa1ec', -- User ID
    'o-onboarding-v2',
    'Onboarding VIP & IT Setup',
    'Automated provisioning flow for VIP hires with manual IT verification steps.',
    'published',
    98,
    0,
    '2026-02-14 08:30:00+00',
    -- NODES
    '[
        { "id": "start", "type": "trigger", "position": { "x": 50, "y": 300 }, "data": { "label": "ATS: Offer Signed", "method": "POST", "endpoint": "https://api.eva.com/hooks/offer-signed", "integrationActive": true } },
        { "id": "create_user", "type": "registerEmployee", "position": { "x": 400, "y": 300 }, "data": { "label": "Create Eva Profile", "system": "Eva People" } },
        { "id": "prov_google", "type": "systemUpdate", "position": { "x": 750, "y": 300 }, "data": { "label": "Provison G-Workspace", "system": "Google Workspace", "action": "create_account", "payload": "{ \"license\": \"enterprise\", \"org_unit\": \"/engineering\" }" } },
        { "id": "wait_kit", "type": "delay", "position": { "x": 1100, "y": 300 }, "data": { "label": "Wait for Shipping", "delayValue": 2, "delayUnit": "days" } },
        { "id": "verify_it", "type": "humanInTheLoop", "position": { "x": 1450, "y": 300 }, "data": { "label": "Verify IT Kit Delivery", "assignee": "IT Logistics", "description": "Confirm that the MacBook Pro and peripherals have been delivered to the candidate.", "timeout": 24 } },
        { "id": "notify_done", "type": "systemUpdate", "position": { "x": 1850, "y": 150 }, "data": { "label": "Welcome Email", "system": "Slack", "action": "send_message", "payload": "{ \"channel\": \"#general\", \"text\": \"Welcome to the team!\" }" } },
        { "id": "notify_fail", "type": "systemUpdate", "position": { "x": 1850, "y": 450 }, "data": { "label": "Escalate Delivery", "system": "Jira", "action": "create_ticket", "payload": "{ \"priority\": \"High\", \"summary\": \"Delivery Failed\" }" } }
    ]'::jsonb,
    -- EDGES
    '[
        { "id": "e1", "source": "start", "target": "create_user", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
        { "id": "e2", "source": "create_user", "target": "prov_google", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
        { "id": "e3", "source": "prov_google", "sourceHandle": "success", "target": "wait_kit", "animated": true, "label": "Success", "style": { "stroke": "#0ea5e9", "strokeWidth": 3 } },
        { "id": "e4", "source": "wait_kit", "target": "verify_it", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
        { "id": "e5", "source": "verify_it", "sourceHandle": "approved", "target": "notify_done", "animated": true, "label": "Delivered", "style": { "stroke": "#10b981", "strokeWidth": 3 } },
        { "id": "e6", "source": "verify_it", "sourceHandle": "rejected", "target": "notify_fail", "animated": true, "label": "Missing", "style": { "stroke": "#f43f5e", "strokeWidth": 3 } }
    ]'::jsonb
),
(
    'b0e3cd88-f190-4a23-a6c8-bbd3ff6aa1ec', -- User ID
    'o-perf-cycle',
    'Quarterly Performance Cycle',
    'Manages the end-to-end performance review process including calibration.',
    'published',
    100,
    0,
    '2026-02-13 14:00:00+00',
    -- NODES
    '[
        { "id": "trig_q1", "type": "trigger", "position": { "x": 50, "y": 250 }, "data": { "label": "Sched: Q1 Cycle", "method": "CRON", "endpoint": "0 9 1 * *", "integrationActive": false } },
        { "id": "gen_forms", "type": "systemUpdate", "position": { "x": 400, "y": 250 }, "data": { "label": "Generate Reviews", "system": "Eva Performance", "action": "bulk_create_reviews", "payload": "{ \"cycle\": \"Q1_2026\", \"template\": \"standard_eng\" }" } },
        { "id": "mgr_review", "type": "humanInTheLoop", "position": { "x": 750, "y": 250 }, "data": { "label": "Manager Assessment", "assignee": "Direct Manager", "description": "Complete the skills assessment and leadership potential index.", "timeout": 72 } },
        { "id": "calib_check", "type": "conditional", "position": { "x": 1150, "y": 250 }, "data": { "label": "Rating Tier?", "switchField": "final_score", "rules": [{ "id": "r1", "label": "High Perf (>4.5)", "field": "score", "operator": "gt", "value": "4.5" }, { "id": "r2", "label": "Low Perf (<2.0)", "field": "score", "operator": "lt", "value": "2.0" }] } },
        { "id": "calc_bonus", "type": "systemUpdate", "position": { "x": 1550, "y": 100 }, "data": { "label": "Calculate Spot Bonus", "system": "Workday Finance", "action": "issue_payment", "payload": "{ \"percentage\": 0.10 }" } },
        { "id": "perf_plan", "type": "humanInTheLoop", "position": { "x": 1550, "y": 400 }, "data": { "label": "Create PIP Plan", "assignee": "HRBP", "description": "Draft a Performance Improvement Plan for the employee.", "timeout": 48 } }
    ]'::jsonb,
    -- EDGES
    '[
        { "id": "e1", "source": "trig_q1", "target": "gen_forms", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
        { "id": "e2", "source": "gen_forms", "sourceHandle": "success", "target": "mgr_review", "animated": true, "style": { "stroke": "#0ea5e9", "strokeWidth": 3 } },
        { "id": "e3", "source": "mgr_review", "sourceHandle": "approved", "target": "calib_check", "animated": true, "label": "Completed", "style": { "stroke": "#10b981", "strokeWidth": 3 } },
        { "id": "e4", "source": "calib_check", "sourceHandle": "r1", "target": "calc_bonus", "animated": true, "label": "High Performer", "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
        { "id": "e5", "source": "calib_check", "sourceHandle": "r2", "target": "perf_plan", "animated": true, "label": "Needs Improv.", "style": { "stroke": "#4f39f6", "strokeWidth": 3 } }
    ]'::jsonb
),
(
    'b0e3cd88-f190-4a23-a6c8-bbd3ff6aa1ec', -- User ID
    'o-offboarding',
    'Secure Offboarding Protocol',
    'Ensures immediate access revocation and asset recovery upon termination.',
    'draft',
    100,
    0,
    null,
    -- NODES
    '[
        { "id": "term_event", "type": "trigger", "position": { "x": 50, "y": 300 }, "data": { "label": "HRIS: Termination", "method": "POST", "endpoint": "/hooks/term", "integrationActive": true } },
        { "id": "revoke_okta", "type": "systemUpdate", "position": { "x": 400, "y": 300 }, "data": { "label": "Revoke SSO Access", "system": "Okta", "action": "deactivate_user", "payload": "{ \"immediate\": true }" } },
        { "id": "wipe_device", "type": "systemUpdate", "position": { "x": 750, "y": 300 }, "data": { "label": "Wipe Corporate Mobile", "system": "Jamf MDM", "action": "remote_wipe", "payload": "{ \"device_type\": \"all\" }" } },
        { "id": "asset_col", "type": "humanInTheLoop", "position": { "x": 1100, "y": 300 }, "data": { "label": "Collect Physical Assets", "assignee": "Office Manager", "description": "Retrieve Laptop (Tag #232), Badge, and Monitor.", "timeout": 24 } },
        { "id": "pay_calc", "type": "humanInTheLoop", "position": { "x": 1450, "y": 300 }, "data": { "label": "Final Severance Calc", "assignee": "Payroll Specialist", "description": "Calculate pro-rated vacation and severance package.", "timeout": 48 } },
        { "id": "archive_emp", "type": "systemUpdate", "position": { "x": 1800, "y": 300 }, "data": { "label": "Archive Employee Record", "system": "Eva People", "action": "archive_profile", "payload": "{ \"reason\": \"termination\" }" } }
    ]'::jsonb,
    -- EDGES
    '[
        { "id": "e1", "source": "term_event", "target": "revoke_okta", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
        { "id": "e2", "source": "revoke_okta", "sourceHandle": "success", "target": "wipe_device", "animated": true, "style": { "stroke": "#0ea5e9", "strokeWidth": 3 } },
        { "id": "e3", "source": "wipe_device", "sourceHandle": "success", "target": "asset_col", "animated": true, "style": { "stroke": "#0ea5e9", "strokeWidth": 3 } },
        { "id": "e4", "source": "asset_col", "sourceHandle": "approved", "target": "pay_calc", "animated": true, "label": "Collected", "style": { "stroke": "#10b981", "strokeWidth": 3 } },
        { "id": "e5", "source": "pay_calc", "sourceHandle": "approved", "target": "archive_emp", "animated": true, "label": "Calculated", "style": { "stroke": "#10b981", "strokeWidth": 3 } }
    ]'::jsonb
);
