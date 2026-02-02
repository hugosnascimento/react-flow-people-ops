insert into workspaces (id, name, api_key_hash)
values (
    '00000000-0000-0000-0000-000000000001',
    'Default Workspace',
    encode(digest('CHANGE_ME', 'sha256'), 'hex')
)
on conflict (id) do nothing;
