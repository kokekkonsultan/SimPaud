<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Session;
use Auth;

class RoleController extends Controller
{
    function __construct()
    {
        $this->middleware(['permission:role-list|role-create|role-edit|role-delete'], ['only' => ['index', 'store']]);
        $this->middleware(['permission:role-create'], ['only' => ['create', 'store']]);
        $this->middleware(['permission:role-edit'], ['only' => ['edit', 'update']]);
        $this->middleware(['permission:role-delete'], ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::paginate(10);

        $delSisa = DB::table('temp_permission')
        ->where('id_user', '=', Auth::user()->id)
        ->delete();
        Session::forget('role_permissions_sess');
        
        // return view('master.roles.index',compact('roles'));
        return Inertia::render('Master/Roles/Index', ['roles' => $roles]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permission = Permission::orderby('name', 'ASC')->get();
        // return view('master.roles.create');
        return Inertia::render('Master/Roles/Create', ['permission' => $permission]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $request->validate([
        //     'name' => 'required|string|max:250',
        //     'guard_name' => 'required|string|max:250',
        // ]);

        $rules = [
            'guard_name' => ['required', 'string', 'max:250'],
            'name' => ['required', 'string', 'max:250'],
        ];

        $messages = [
            'guard_name.required' => 'Nama Guard harus diisi.',
            'name.required' => 'Nama Role harus diisi.',
        ];

        $request->validate($rules, $messages);

        $dataroles = array(
            'name' => $request->name,
            'guard_name' => $request->guard_name,
            'created_at' => date('Y-m-d H:i:s'),
        );
        
        $simpan = Role::create($dataroles);
        // $permissions = Permission::whereIn('id', $request->permission)->get(['name'])->toArray();
        // $simpan->syncPermissions($request->permission);

        $id_role = DB::table('roles')->orderby('id', 'DESC')->first()->id;
        $role = Role::find($id_role);
        $numericPermissionArray = [];
        $temp_permission = DB::table('temp_permission')
            ->where('id_user', '=', Auth::user()->id)
            ->where('id_role','=',0)
            ->get();
        foreach ($temp_permission as $row) {
            $numericPermissionArray[] = intval($row->id_permission);
        }
        $role->syncPermissions($numericPermissionArray);

        if ($simpan) {
            return redirect()->route('roles.index')->with('message', 'Data Roles berhasil disimpan!');
        } else {
            return redirect()->route('roles.index')->with('error', 'Data Roles gagal disimpan!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // return view('master.roles.show', ['roles' => $roles]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $roles = Role::find($id);

        if(Session::get('role_permissions_sess') == 0){
            $role_permissions = DB::table('role_has_permissions')
                ->where('role_id','=',$id)
                ->get();
            foreach ($role_permissions as $row) {
                $cek = DB::table('temp_permission')
                ->where('id_user','=',Auth::user()->id)
                ->where('id_permission','=',$row->permission_id)
                ->where('id_role','=',$id)
                ->count();

                if($cek == 0){
                    $ins = DB::table('temp_permission')
                        ->insert(array(
                            'id_user' => Auth::user()->id,
                            'id_permission' => $row->permission_id,
                            'id_role' => $id,
                            'created_at' => date('Y-m-d H:i:s')
                    ));
                }
            }
            Session::put('role_permissions_sess', 1);
        }

        $permission = Permission::select('permissions.*', DB::raw("CASE WHEN sik.id_permission IS NOT NULL THEN true ELSE false END AS ceked"))
        ->leftjoin('temp_permission AS sik', function($join) use ($id){
            $join->on('sik.id_permission','=','permissions.id');
            $join->on('sik.id_role','=',DB::raw($id));
        })->orderby('permissions.name', 'ASC')->get();

        // $role_permissions = DB::table("role_has_permissions")->where("role_has_permissions.role_id",$id)
        //     ->pluck('role_has_permissions.permission_id','role_has_permissions.permission_id')
        //     ->all();

        // return view('master.roles.edit',compact('roles'));
        return Inertia::render('Master/Roles/Edit', [
            'roles' => $roles,
            'permission' => $permission,
            // 'role_permissions' => $role_permissions
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // $request->validate([
        //     'name' => 'required|string|max:250',
        //     'guard_name' => 'required|string|max:250',
        // ]);

        $rules = [
            'guard_name' => ['required', 'string', 'max:250'],
            'name' => ['required', 'string', 'max:250'],
        ];

        $messages = [
            'guard_name.required' => 'Nama Guard harus diisi.',
            'name.required' => 'Nama Role harus diisi.',
        ];

        $request->validate($rules, $messages);

        $dataroles = array(
            'name' => $request->name,
            'guard_name' => $request->guard_name,
            'updated_at' => date('Y-m-d H:i:s'),
        );
        $simpan = Role::where('id', $id)->update($dataroles);

        // for($i = 0; $i < sizeof($request->permission); $i++){
        //     echo $request->permission[$i].'-';
        // }

        $del = DB::table('role_has_permissions')
        ->where('role_id','=',$id)
        ->delete();

        $role = Role::find($id);
        $numericPermissionArray = [];
        $temp_permission = DB::table('temp_permission')
            ->where('id_user', '=', Auth::user()->id)
            ->where('id_role','=',$id)
            ->get();
        foreach ($temp_permission as $row) {
            $numericPermissionArray[] = intval($row->id_permission);
        }
        $role->syncPermissions($numericPermissionArray);

        $delSisa = DB::table('temp_permission')
        ->where('id_user', '=', Auth::user()->id)
        ->where('id_role','=',$id)
        ->delete();

        if ($simpan) {
            return redirect()->route('roles.index')->with('message', 'Data Roles berhasil disimpan!');
        } else {
            return redirect()->route('roles.index')->with('error', 'Data Roles gagal disimpan!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Role::where('id', $id)->delete();

        // return redirect()->route('roles.index')->with('message', 'Data Roles berhasil dihapus!');
        return redirect()->back();
    }

    public function pilih_permission($id_role, $id_permission)
    {
        // echo $id_role.','.$id_permission;
        // exit;
        if($id_role){
            $id_role = $id_role;
        }else{
            $id_role = 0;
        }
        $cek = DB::table('temp_permission')
        ->where('id_user','=',Auth::user()->id)
        ->where('id_permission','=',$id_permission)
        ->where('id_role','=',$id_role)
        ->count();

        if($cek == 0){
           $ins = DB::table('temp_permission')
                ->insert(array(
                    'id_user' => Auth::user()->id,
                    'id_permission' => $id_permission,
                    'id_role' => $id_role,
                    'created_at' => date('Y-m-d H:i:s')
            ));
        }else{
            $del = DB::table('temp_permission')
            ->where('id_user','=',Auth::user()->id)
            ->where('id_permission','=',$id_permission)
            ->where('id_role','=',$id_role)
            ->delete();
        }

        return redirect()->back();
    }
}
