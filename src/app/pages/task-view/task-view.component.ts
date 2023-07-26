import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from './../../task.service';
import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
  tasks:Task[]|undefined;
  lists:List[]|undefined;
  selectedListId:string='';
  constructor(private taskService:TaskService,private route:ActivatedRoute,private router:Router){}
  ngOnInit() {
    this.route.params.subscribe(
      (params:Params)=>{
        if(params['listId']){
          this.selectedListId=params['listId'];
          this.taskService.getTasks(params['listId']).subscribe((tasks:any)=>{
            this.tasks=tasks;
          })
        }else{
          this.tasks=undefined;
        }
      }
    )
    this.taskService.getLists().subscribe((lists:any)=>{
      this.lists=lists;
    })
  }
  onTaskClick(task:Task){
    this.taskService.complete(task).subscribe(()=>{
      console.log('Completed succesfully')
      task.completed=!task.completed;
    });
  }
  onDeleteList(){
    this.taskService.deleteList(this.selectedListId).subscribe((res)=>{
      console.log(res);
      this.router.navigate(['/lists'])
    });
  }
  onTaskDelete(id:any){
    this.taskService.deleteTask(this.selectedListId,id).subscribe((res)=>{
      this.tasks=this.tasks?.filter(val=>val._id!==id);
      console.log(res);
    });
  }
}
